import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'nestjs-prisma';
import { Permission } from '@prisma/client';
import { GetPermissionDto } from './dto/get-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async isNameUnique(name: string): Promise<boolean> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        name: name,
      },
    });
    return permission ? false : true;
  }

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      // Validatea name
      const isNimUnique = await this.isNameUnique(createPermissionDto.name);
      if (!isNimUnique) {
        throw new ConflictException('Nama sudah digunakan');
      }

      const createPermission = await this.prisma.permission.create({
        data: createPermissionDto,
      });
      return 'Successfuly create permission';
    } catch (error) {
      throw new Error(`Failed to create permission -  ${error.message}`);
    }
  }

  async findAll() {
    try {
      const permissions = await this.prisma.permission.findMany();

      // Transform entities to getDTO
      const permissionsDto: GetPermissionDto[] = [];
      for (const permission of permissions) {
        const permissionDto: GetPermissionDto = {
          id: permission.id,
          name: permission.name,
          action: permission.action
        };
        permissionsDto.push(permissionDto);
      }
      return permissionsDto;
    } catch (error) {
      throw new Error(`Failed to get all permissions - ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const permission: Permission = await this.prisma.permission.findUnique({
        where: {
          id: id,
        },
      });

      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      // Transform entities to getDTO
      const permissionDto: GetPermissionDto = {
        id: permission.id,
        name: permission.name,
        action: permission.action
      };

      return permissionDto;
    } catch (error) {
      throw new Error(`Failed to get permission by id - ${error.message}`);
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission: Permission = await this.prisma.permission.findUnique({
        where: {
          id: id,
        },
      });

      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      // Validatea name
      const isNimUnique = await this.isNameUnique(updatePermissionDto.name);
      if (!isNimUnique) {
        throw new ConflictException('Nama sudah digunakan');
      }

      console.log(updatePermissionDto);
      const createPermission = await this.prisma.permission.update({
        where: { id: id },
        data: {
          name: updatePermissionDto.name,
        },
      });
      return 'Successfuly update permission';
    } catch (error) {
      throw new Error(`Failed to update permission -  ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const permission: Permission = await this.prisma.permission.findUnique({
        where: {
          id: id,
        },
      });

      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      await this.prisma.permissionsHasRole.deleteMany({
        where: { permission_id: id },
      });

      await this.prisma.permissionsHasSub_Role.deleteMany({
        where: { permission_id: id },
      });

      // Hapus permission
      await this.prisma.permission.delete({
        where: { id: id },
      });


      return 'Success delete permission';
    } catch (error) {
      throw new Error(`Failed to delete permission -  ${error.message}`);
    }
  }
}
