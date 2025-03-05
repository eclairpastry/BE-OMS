import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPassword {
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
