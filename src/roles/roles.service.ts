import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRolesDto } from 'src/roles/dto/create-roles.dto';
import { ListRolesDto } from 'src/roles/dto/list-roles.dto';
import { Response } from 'express';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRolesDto) {
    try {
        const { name, subrole_id, permission_id } = createRoleDto;

        const createdRole = await this.prisma.role.create({
            data: {
                name,
                subroles: {
                    connect: subrole_id ?? [],
                },
                permissions: {
                    connect: permission_id ?? [],
                },
            },
            include: {
                subroles: true,
                permissions: true,
            },
        });
        
        return createdRole;
    } catch (error) {
        throw new Error(`Failed to create role: ${error.message}`);
    }
}

  async roleList(): Promise<any[]> {
    try {
      const roles = await this.prisma.role.findMany({
        include: {
          subroles: true,
          permissions: true,
        },
      });
      return roles.map(role => ({
        id: role.id,
        name: role.name,
        subroles: role.subroles.map(subrole => ({
          id: subrole.id,
          name: subrole.name,
        })),
        permissions: role.permissions.map(permission => ({
          id: permission.id,
        })),
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching roles list');
    }
  }

  async roleDetail(id): Promise<any> {
    try {
      const roleId = parseInt(id);
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      console.error(error);
      throw new Error('Server Error, cannot get role');
    }
  }

  async roleUpdate(id: string, updateRoleDto: UpdateRolesDto): Promise<any> {
    try {
      const roleId = parseInt(id, 10);

      const { name, subrole_id, permission_id } = updateRoleDto;

      const subrolesConnect = subrole_id.map((id) => ({ id: id }));
      const permissionsConnect = permission_id.map((id) => ({
        permission_id: id,
      }));

      const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          name: name,
          subroles: {
            connect: subrolesConnect,
          },
          permissions: {
            createMany: {
              data: permissionsConnect,
            },
          },
        },
      });
      return updatedRole;
    } catch (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }
  }

  async deleteRole(id: string): Promise<boolean> {
    try {
      const roleId = parseInt(id, 10);
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      console.log(role)
      if (!role) {
        return false;
      }

      await this.prisma.role.delete({
        where: { id: role.id },
      }).then(async () => {
        await this.prisma.sub_Role.deleteMany({
          where: { role_id: role.id },
        });
      
        await this.prisma.users.updateMany({
          where: { role_id: roleId },
          data: { role_id: null },
        });
      }).catch((error) => {
        console.error("Gagal menghapus peran:", error);
      });
      


      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
