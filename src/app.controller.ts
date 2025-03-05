import { Controller, Get, Param } from '@nestjs/common';
import { Users } from '@prisma/client';
import { AppService } from './app.service';
import { Public } from './common/decorators';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /*@Get()
  users(): Promise<Users[]> {
    return this.appService.users();
  }

  @Get(':userId')
  user(@Param('userId') userId: string): Promise<Users> {
    return this.appService.user(userId);
  }*/
}
