import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Response, response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const dataCreate =
        await this.permissionsService.create(createPermissionDto);
      return res.status(201).json({
        statusCode: 201,
        message: dataCreate,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get()
  async findAll(@Res() response: Response): Promise<Response> {
    try {
      const dataAllPermision = await this.permissionsService.findAll();
      return response.status(200).json({
        statusCode: 200,
        message: 'Successfully get all permissions',
        data: dataAllPermision,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const dataPermisionByID = await this.permissionsService.findOne(+id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Successfully get permissions by id',
        data: dataPermisionByID,
      });
    } catch (error) {
      if (NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
          error: 'Page not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      } else {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const updatePermision = await this.permissionsService.update(
        +id,
        updatePermissionDto,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: updatePermision,
      });
    } catch (error) {
      if (NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
          error: 'Page not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      } else {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    try {
      const deletePermission = await this.permissionsService.remove(+id);
      return response.status(HttpStatus.OK).json({
        status_code: HttpStatus.OK,
        message: deletePermission,
      });
    } catch (error) {
      if (NotFoundException) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
          error: 'Page not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      } else {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          error: 'Internal Server Error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
