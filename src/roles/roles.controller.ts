import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRolesDto } from "./dto/create-roles.dto";
import { Response, response } from 'express'; 
import { UpdateRolesDto } from "./dto/update-roles.dto";
import { Public } from "../common/decorators";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post('/')
    async createRoles(
        @Body() createRolesDto: CreateRolesDto, 
        @Res() res: Response,
    ): Promise<Response>{
        try {
            const createdRole = await this.rolesService.createRole(createRolesDto); 

            const { id, name, subroles, permissions } = createdRole;

            return res.status(201).json({
                status_code: 201,
                message: 'Role Created Successfully',
                data: {
                    id,
                    name,
                    subrole_id: subroles && subroles.length > 0 ? subroles.map(subrole => subrole.id) : null,
                    permission_id: permissions && permissions.length > 0 ? permissions.map(perm => perm.id) : null,
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Internal Server Error',
            });
        }
    }

    @Get('/')
    async getAllRolesList(@Res() response: Response): Promise<Response> {
        try {
            const roles = await this.rolesService.roleList();
            return response.status(200).json({
                statuscode: 201,
                message: "Successfully",
                data: roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    subrole_id: role.subroles && role.subroles.length > 0 ? role.subroles.map(subrole => subrole.id) : null,
                    permission_id: role.permission && role.permission.length > 0 ? role.permission.map(perm => perm.id) : null,
                }))
            });
        }catch(error){
            console.error(error);
            throw new Error('Error fetching roles list');
        }
    }

    @Get('/:id')
    async getRoleById(@Param('id') id: number, @Res() response: Response): Promise<Response> {
        try {
            const role = await this.rolesService.roleDetail(id);
            if (!role) {
                return response.status(404).json({
                    statuscode: 404,
                    message: "Role not found",
                    data: null
                });
            }
            return response.status(200).json({
                statuscode: 200,
                message: "Success",
                data: {
                    id: role.id,
                    name: role.name,
                    subrole_id: role.subroles && role.subroles.length > 0 ? role.subroles.map(subrole => subrole.id) : null,
                    permission_id: role.permission && role.permission.length > 0 ? role.permission.map(perm => perm.id) : null,
                }
            });

        } catch(error) {
            console.error(error);
            throw new Error('Error fetching role');
        }
    }

    @Put('/:id')
    async updateRole(
        @Param('id') id: string, 
        @Body() updateRolesDto: UpdateRolesDto,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const updatedRole = await this.rolesService.roleUpdate(id, updateRolesDto);
            return response.status(201).json({
                statuscode: 201,
                message: "Role updated successfully",
                data: {
                    id: updatedRole.id,
                    name: updatedRole.name,
                    subrole_id: updatedRole.subroles && updatedRole.subroles.length > 0 ? updatedRole.subroles.map(subrole => subrole.id) : null,
                    permission_id: updatedRole.permission && updatedRole.permission.length > 0 ? updatedRole.permission.map(perm => perm.id) : null,
                },
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    @Delete('/:id')
    async deleteRole(
        @Param('id') id: string,
        @Res() response: Response
    ): Promise<Response> {
        try {
            const deleted = await this.rolesService.deleteRole(id);
            if (deleted) {
                return response.status(200).json({
                    status_code: 200,
                    message: "Success delete role"
                });
            } else {
                return response.status(404).json({
                    status_code: 404,
                    message: "Role not found"
                });
            }
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                status_code: 500,
                message: `Internal Server Error - ${error.message}`
            });
        }
    }
}
