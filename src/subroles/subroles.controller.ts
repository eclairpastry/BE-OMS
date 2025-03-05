import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SubrolesService } from './subroles.service';
import {
  getSubRolesDto,
  createSubRolesDto,
  updateSubRolesDto,
} from './dto/subroles.dto';
import { Response } from 'express';
import { Public } from '../common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sub-Roles')
@Controller({
  path: 'roles/:role_id/subroles',
  version: '1',
})
export class SubrolesController {
  constructor(private readonly SubrolesService: SubrolesService) {}

  @Get('/:id')
  async getSubroleById(
    @Param('role_id') role_id: number,
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const subrole = await this.SubrolesService.getSubrolesById(
        Number(role_id),
        id,
      );

      if (!subrole) {
        return response.status(404).json({
          statuscode: 404,
          message: 'Subrole not found',
          data: null,
        });
      }

      return response.status(200).json({
        statuscode: 200,
        message: 'Success',
        data: {
          id: subrole.id,
          name: subrole.name,
          permission: subrole.permissions.map((item) => {
            return item.permissions;
          }),
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching subrole');
    }
  }

  @Get('/')
  async getSubroles(
    @Param('role_id') role_id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const subroles = await this.SubrolesService.getSubroles(Number(role_id));

      // if (!subroles === undefined) {
      //   return res.status(404).json({            role checking error
      //     status_code: 404,
      //     message: 'Role not found',
      //   });
      // }

      return res.status(200).json({
        statuscode: 200,
        message: 'Successfully',
        data: subroles.map((subrole) => ({
          id: subrole.id,
          name: subrole.name,
          permission: subrole.permissions.map((item) => {
            return item.permissions;
          }),
        })),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status_code: 500,
        message: 'Server Error, cannot get subroles',
      });
    }
  }

  @Post('/')
  async createSubRoles(
    @Param('role_id', ParseIntPipe) role_id: number,
    @Body() createSubRolesDto: createSubRolesDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const createdSubRole = await this.SubrolesService.createSubRole(
        role_id,
        createSubRolesDto,
      );

      const { id, name, permissions } = createdSubRole;

      return res.status(201).json({
        status_code: 201,
        message: 'Subrole Created Successfully',
        data: {
          id,
          name,
          permission_id:
            permissions && permissions.length > 0
              ? permissions.map((perm) => ({
                  id: perm.permissions.id,
                  action: perm.permissions.action,
                }))
              : null,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }

  @Put('/:id')
  async updateSubRoles(
    @Param('role_id', ParseIntPipe) role_id: number,
    @Param('id') id: string,
    @Body() updateSubRolesDto: updateSubRolesDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updateSubRole = await this.SubrolesService.updateSubRole(
        role_id,
        id,
        updateSubRolesDto,
      );

      const { name, permissions } = updateSubRole;

      return res.status(201).json({
        status_code: 201,
        message: 'Subrole Created Successfully',
        data: {
          id,
          name,
          permission_id:
            permissions && permissions.length > 0
              ? permissions.map((perm) => ({
                  id: perm.permissions.id,
                  action: perm.permissions.action,
                }))
              : null,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  }

  @Delete('/:id')
  async deleteSubRole(
    @Param('role_id') role_id: number,
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const deleted = await this.SubrolesService.deleteSubRole(
        Number(role_id),
        id,
      );
      if (deleted) {
        return response.status(200).json({
          status_code: 200,
          message: 'Success delete subrole',
        });
      } else {
        return response.status(404).json({
          status_code: 404,
          message: 'Subrole not found',
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        status_code: 500,
        message: `Internal Server Error - ${error.message}`,
      });
    }
  }
}
