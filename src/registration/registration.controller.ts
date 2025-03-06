import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/config/multer.config';
import { RegistrationDto } from './dto/registration.dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators';
import { AuthService } from 'src/auth/auth.service';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { join } from 'path';

@ApiTags('Registration')
@Controller({
  path: 'registration',
  version: '1',
})
export class RegistrationController {
  constructor(
    private readonly registrationService: RegistrationService,
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('/registration')
  @UseInterceptors(AnyFilesInterceptor(multerConfig))
  async registrationCA(
    @Body() registrationDto: RegistrationDto,
    @UploadedFiles() files: Express.Multer.File[], // This will receive all files in an array
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Map files to their respective field names
      const image = files.find(file => file.fieldname === 'users_image');

      // Proceed with service call by passing the registration DTO instance and the image
      const registration = await this.registrationService.registrationCA(registrationDto, image);

      return res.status(HttpStatus.CREATED).json({
        status_code: HttpStatus.CREATED,
        message: 'Registration Successfully',
        data: registration,
      });
    } catch (error: any) {
      console.error('Registration Error:', error.message);

      return res.status(HttpStatus.BAD_REQUEST).json({
        status_code: HttpStatus.BAD_REQUEST,
        message: 'An error occurred while Registration',
        error: error.message,
      });
    }
  }

  @Public()
  @Get('/lists-registration')
  async getAllCA(@Res() res: Response): Promise<Response> {
    try {
        const register = await this.registrationService.getAllCA();
        return res.status(HttpStatus.OK).json({
            status_code: HttpStatus.OK,
            message: 'Successfully',
            data: register
        });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Server Error, cannot get data',
        });
    }
  }
  
  @Public()
  @Get('/detail-registration')
  async getCAById(
          @Param('id') id: string,
          @Res() res: Response,
          @Req() req: Request
      ): Promise<Response> {
          try {
              const user = await this.registrationService.getUserById(id);
              if (!user) {
                  return res.status(HttpStatus.NOT_FOUND).json({
                      status_code: HttpStatus.NOT_FOUND,
                      message: 'User not found',
                  });
              }
              return res.status(HttpStatus.OK).json({
                  status_code: HttpStatus.OK,
                  message: 'Successfully',
                  data: user
              });
          } catch (error) {
              console.error(error);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  status_code: HttpStatus.INTERNAL_SERVER_ERROR,
                  message: 'Server Error, cannot get data',
              });
          }
  }

  @Public()
  @Put('/update-register/:id')
   async updateRegister(
          @Param('id') id: string,
          @Body() updateRegisterDto: UpdateRegistrationDto,
          @Res() res: Response
      ): Promise<Response> {
          try {
              const updatedUser = await this.registrationService.updateUser(id, updateRegisterDto);
              return res.status(HttpStatus.OK).json({
                  status_code: HttpStatus.OK,
                  message: 'User updated successfully',
                  data: updatedUser
              });
          } catch (error) {
              console.error(error);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  message: 'Server Error, cannot update data',
              });
          }
  }

  @Public()
  @Delete('/delete-register/:id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response
): Promise<Response> {
    try {
        const deleted = await this.registrationService.deleteUser(id);
        if (deleted) {
            return res.status(HttpStatus.OK).json({
                status_code: HttpStatus.OK,
                message: 'User deleted successfully'
            });
        } else {
            return res.status(HttpStatus.NOT_FOUND).json({
                status_code: HttpStatus.NOT_FOUND,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Server Error, cannot delete data',
        });
    }
  }

  @Public()
  @Post('/import-csv-register')
  @UseInterceptors(FileInterceptor('file'))
  async importCandidates(@UploadedFile() file: Express.Multer.File) {
    await this.registrationService.importCandidates(file);
    return { message: 'Import completed successfully.' };
  }
}
