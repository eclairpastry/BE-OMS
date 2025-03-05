import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  getSubRolesDto,
  createSubRolesDto,
  updateSubRolesDto,
} from './dto/subroles.dto';

@Injectable()
export class SubrolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubrolesById(role_id: number, id): Promise<any> {
    try {
      const subroleId = parseInt(id);
      const subrole = await this.prisma.sub_Role.findUnique({
        where: {
          role_id: role_id,
          id: subroleId,
        },
        include: {
          permissions: {
            include: {
              permissions: {
                select: {
                  id: true,
                  name: true,
                  action: true,
                },
              },
            },
          },
        },
      });

      return subrole;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching subroles detail');
    }
  }

  async getSubroles(role_id: number): Promise<any[]> {
    try {
      return this.prisma.sub_Role.findMany({
        where: {
          role_id: role_id,
        },
        include: {
          permissions: {
            include: {
              permissions: {
                select: {
                  id: true,
                  name: true,
                  action: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching subroles list');
    }
  }
  async createSubRole(role_id: number, createSubRoleDto: createSubRolesDto) {
    try {
      const { name, permissions_id } = createSubRoleDto;

      const createdSubRole = await this.prisma.sub_Role.create({
        data: {
          name,
          role: {
            connect: {
              id: role_id,
            },
          },
          permissions: {
            createMany: {
              data: permissions_id.map((id) => ({ permission_id: id })),
            },
          },
        },
        include: {
          permissions: {
            include: {
              permissions: true,
            },
          },
        },
      });
      return createdSubRole;
    } catch (error) {
      throw new Error(`Failed to create subrole: ${error.message}`);
    }
  }

  async updateSubRole(
    role_id: number,
    id: string,
    updateSubRoleDto: updateSubRolesDto,
  ): Promise<any> {
    try {
      const subrole_id = parseInt(id, 10);
      const { name, permissions_id } = updateSubRoleDto;

      const updateSubRole = await this.prisma.sub_Role.update({
        where: { id: subrole_id },
        data: {
          name,
          role: {
            connect: {
              id: role_id,
            },
          },
          permissions: {
            deleteMany: {
              subrole_id: subrole_id,
            },
            createMany: {
              data: permissions_id.map((perm_id) => ({
                permission_id: perm_id,
              })),
              skipDuplicates: true,
            },
          },
        },
        include: {
          permissions: {
            include: {
              permissions: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      return updateSubRole;
    } catch (error) {
      throw new Error(`Failed to update subrole: ${error.message}`);
    }
  }

  async deleteSubRole(role_id: number, id): Promise<boolean> {
    try {
      const subrole_id = parseInt(id, 10);
      const sub_role = await this.prisma.sub_Role.findUnique({
        where: { role_id: role_id, id: subrole_id },
      });
      if (!sub_role) {
        return false;
      }
      await this.prisma.sub_Role.delete({
        where: { id: subrole_id },
      });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
