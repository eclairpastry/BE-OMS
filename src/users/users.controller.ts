import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UsersService } from "./users.service";
import { CreateUsersDto } from "./dto/create-user.dto";
import { UpdateUsersDto } from "./dto/update-user.dto";
import { Response } from 'express';
import { Public } from '../common/decorators';
import { Ability } from "@casl/ability";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { AuthService } from "../auth/auth.service";
import { CaslAbilityGuard } from "../casl/casl.guard";
import { Action, CaslAbility, Subject } from "../casl/permissions.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        // private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly authService: AuthService,
    ) {}
    
    @Public()
    @Post('/create-users')
    // @UseGuards(CaslAbilityGuard)
    // @CaslAbility('create:users')
    // @Subject('users') 
    // @Action('create') 
    async createUser(
        @Body() createUsersDto: CreateUsersDto,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const createdUser = await this.usersService.createUser(createUsersDto);
            return res.status(HttpStatus.CREATED).json({
                status_code: HttpStatus.CREATED,
                message: 'User Created Successfully',
                data: createdUser
            });
        } catch (error) {
            if (error.message.includes('duplicate key value')) {
                return res.status(HttpStatus.CONFLICT).json({
                    message: 'User already exists',
                });
            }
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Server Error, cannot create user',
            });
        }
    }

    @Public()
    @Get('/list-users')
    // @UseGuards(CaslAbilityGuard)
    // @CaslAbility('read:users')
    // @Subject('users') 
    // @Action('read') 

    async getAllUsers(@Res() res: Response): Promise<Response> {
        try {
            const users = await this.usersService.getAllUsers();
            return res.status(HttpStatus.OK).json({
                status_code: HttpStatus.OK,
                message: 'Successfully',
                data: users
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Server Error, cannot get data',
            });
        }
    }

    @Public()
    @Get('/detail-users/:id')
    // @UseGuards(CaslAbilityGuard)
    // @CaslAbility('read:users')
    // @Subject('users') 
    // @Action('read') 

    async getUserById(
        @Param('id') id: string,
        @Res() res: Response,
        @Req() req: Request
    ): Promise<Response> {
        try {
            const user = await this.usersService.getUserById(id);
            if (!user) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Server Error, cannot get data',
                });
            }
            return res.status(HttpStatus.OK).json({
                status_code: HttpStatus.OK,
                message: 'Successfully',
                data: user
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.NOT_FOUND).json({
                status_code: HttpStatus.NOT_FOUND,
                message: 'User not found',
            });
        }
    }

    @Public()
    @Put('/update-users/:id')
    // @UseGuards(CaslAbilityGuard)
    // @CaslAbility('update:users')
    // @Subject('users') 
    // @Action('update') 
    
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUsersDto,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const updatedUser = await this.usersService.updateUser(id, updateUserDto);
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
    
    @Delete('/delete-users/:id')
    // @UseGuards(CaslAbilityGuard)
    // @CaslAbility('delete:users')
    // @Subject('users') 
    // @Action('delete') 
    async deleteUser(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const deleted = await this.usersService.deleteUser(id);
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

    @Post('/:id/upload-image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/images',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
            }
        }
    }))
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Res() res: Response
    ): Promise<Response> {
        try {
            if (!image) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'No image uploaded',
                });
            }

            const imagePath = image.path;
            await this.usersService.updateUserImage(id, imagePath);

            return res.status(HttpStatus.OK).json({
                status_code: HttpStatus.OK,
                message: 'Image uploaded successfully',
                imagePath
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Server error, cannot upload image',
            });
        }
    }
    
    @Get('/images/:filename')
    @Public()
    async serveImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
        res.sendFile(filename, { root: './public/images/' });
    }
}
