import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { AuthDto,ForgotPassword, ResetPasswordDto } from './dto';
import { Tokens } from './types';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res() res: any): Promise<Tokens> {
    try {
      const tokens = await this.authService.login(dto);
      res.header('Authorization', `Bearer ${tokens.access_token}`);
      return res.status(HttpStatus.OK).json({ message: 'Login successful',token: tokens.access_token });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
  }

  @Put('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: any
  ) {
    try {
      const { oldPassword, newPassword } = updatePasswordDto;
      await this.authService.changePassword(req, oldPassword, newPassword);
      return res.status(HttpStatus.OK).json({ message: 'Password changed successfully'});
    } catch (error) {
      return { error: error.message };
    }
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() ForgotPasswordDto: ForgotPassword): Promise<{ message: string }> {
    try {
      const { message } = await this.authService.forgotPassword(ForgotPasswordDto);
      return { message };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @Public()
  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string,  @Body() resetPassword: ResetPasswordDto,@Res() res: any): Promise<void> {
    const { newPassword,confirmPassword } = resetPassword
    try {
      await this.authService.resetPassword(token,newPassword,confirmPassword);
      return res.status(HttpStatus.OK).json({ message: 'Password reset successfully'});
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
