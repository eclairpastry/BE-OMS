import { ConflictException, Injectable, NotFoundException,Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RegistrationDto } from './dto/registration.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import * as fs from 'fs';
import { Readable } from 'stream';
import csvParser from 'csv-parser';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
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
            role_id: null,
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

    async importCandidates(file: Express.Multer.File): Promise<void> {
      if (!file) {
        throw new Error('No file provided');
      }
  
      let csvStream: NodeJS.ReadableStream;
      if (file.buffer) {
        csvStream = Readable.from(file.buffer);
      } else if (file.path) {
        csvStream = fs.createReadStream(file.path);
      } else {
        throw new Error('Uploaded file does not contain a valid buffer or path.');
      }
  
      return new Promise((resolve, reject) => {
        const rows: any[] = [];
        csvStream
          .pipe(csvParser())
          .on('data', (data) => {
            // Normalize keys: trim and convert to lowercase.
            const normalizedRow = Object.keys(data).reduce((acc, key) => {
              acc[key.trim().toLowerCase()] = data[key];
              return acc;
            }, {} as any);
            console.log("Normalized row:", normalizedRow);
            this.logger.debug(`Normalized row: ${JSON.stringify(normalizedRow)}`);
            rows.push(normalizedRow);
          })
          .on('end', async () => {
            console.log(`Finished reading CSV file. Total rows: ${rows.length}`);
            this.logger.log(`Finished reading CSV file. Total rows: ${rows.length}`);
            for (const row of rows) {
              const {
                nama,
                nim,
                email,
                no_telp,
                jenis_kelamin,
                fakultas,
                program_studi,
                lk1,
                lk2,
                sc,
                keaktifan,
                rerata,
              } = row;
  
              if (!nama) {
                this.logger.error(`Missing 'nama' in row: ${JSON.stringify(row)}`);
                continue; // Skip this row if 'nama' is missing.
              }
    
              try {
                console.log(`Processing row for NIM: ${nim}`);
                this.logger.debug(`Processing row: ${JSON.stringify(row)}`);
    
                // Create a new User record.
                const createdUser = await this.prisma.users.create({
                  data: {
                    nra: null,
                    nim,
                    nama,
                    username: null,
                    email,
                    password: null,
                    no_telp,
                    jenis_kelamin,
                    agama: null,
                    fakultas,
                    program_studi,
                    status: null,
                  },
                });
                console.log(`Created user with id: ${createdUser.id}`);
                this.logger.debug(`Created user: ${JSON.stringify(createdUser)}`);
    
                // Create the associated Candidate record.
                await this.prisma.candidate.create({
                  data: {
                    user_id: createdUser.id,
                    lk1: parseFloat(lk1),
                    lk2: parseFloat(lk2),
                    sc: parseFloat(sc),
                    keaktifan: parseFloat(keaktifan),
                    rerata: parseFloat(rerata),
                  },
                });
                console.log(`Created candidate for user id: ${createdUser.id}`);
                this.logger.debug(`Created candidate for user id: ${createdUser.id}`);
              } catch (error) {
                console.error(`Error importing row for NIM ${nim}: ${error.message}`);
                this.logger.error(
                  `Error importing row for NIM ${nim}: ${error.message}`,
                  error.stack,
                );
              }
            }
            this.logger.log(`Imported ${rows.length} rows successfully.`);
            resolve();
          })
          .on('error', (error) => {
            console.error(`Error reading CSV file: ${error.message}`);
            this.logger.error(`Error reading CSV file: ${error.message}`, error.stack);
            reject(error);
          });
      });
    }
}

