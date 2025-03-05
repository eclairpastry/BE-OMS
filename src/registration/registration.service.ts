import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RegistrationDto } from './dto/registration.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Injectable()
export class RegistrationService {
    constructor(
      private prisma: PrismaService,
      private config: ConfigService,
    ) {}

    async registrationCA(registration: RegistrationDto, image: Express.Multer.File ): Promise<{ id: string; nama: string; nim: string; }> {
      try {
        const existingUser = await this.prisma.users.findFirst({
          where: {
            OR: [
              { username: registration.username },
              { email: registration.email },
              { nim: registration.nim },
              { nra: registration.nra }
            ]
          }
        });
  
        if (existingUser) {
          throw new ConflictException('Username, email, NIM, or NRA is already in use');
        }
  
        const usersImages = image ? `${process.env.BASE_URL}uploads/users_image/${image.filename}` : null;
        const hashedPassword = await bcrypt.hash(registration.password, 10);
        const createdUser = await this.prisma.users.create({
          data: {
            ...registration,
            image: usersImages,
            nra: null,
            role_id: 7,
            password: hashedPassword
          }
        }); 
        console.log(createdUser);
        
        return {
          id: createdUser.id,
          nama: createdUser.nama,
          nim: createdUser.nim,
        };
      }  catch (error: any) {
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }
  
    async getAllCA(): Promise<any[]> {
      try {
        return await this.prisma.users.findMany({
          where: {
            role_id: 7,
          },
          select: {
            id: true,
            nim: true,
            nama: true,
            jenis_kelamin: true,
            program_studi: true,
          },
        });
      } catch (error: any) {
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
      }  catch (error: any) {
        // Rethrow if it's already a ConflictException
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }
  
    async updateUser(id: string, updateUserDto: UpdateRegistrationDto): Promise<any> {
      try {
        return await this.prisma.users.update({
          where: { id: id }, 
          data: updateUserDto,
        });
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
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

