import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUsersDto: CreateUsersDto): Promise<any> {
    try {
      const existingUser = await this.prisma.users.findFirst({
        where: {
          OR: [
            { username: createUsersDto.username },
            { email: createUsersDto.email },
            { nim: createUsersDto.nim }
          ]
        }
      });

      if (existingUser) {
        throw new ConflictException('Username, email, or NIM is already in use');
      }

      const hashedPassword = await bcrypt.hash(createUsersDto.password, 10);
      const createdUser = await this.prisma.users.create({
        data: {
          ...createUsersDto,
          password: hashedPassword
        }
      }); 
      return createdUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      return await this.prisma.users.findMany({
        where: {
          status: 'Active' 
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      const user = await this.prisma.users.findUnique({ where: { id: id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUsersDto): Promise<any> {
    try {
      return await this.prisma.users.update({
        where: { id: id }, 
        data: updateUserDto,
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async updateUserImage(userId: string, imagePath: string): Promise<void> {
    try {
      await this.prisma.users.update({
        where: { id: userId },
        data: { image: imagePath },
      });
    } catch (error) {
      throw new Error(`Failed to update user image: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const deleted = await this.prisma.users.delete({ where: { id: id } }); 
      return !!deleted;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
