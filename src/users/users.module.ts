import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule, JwtService } from '@nestjs/jwt'; 
import { AuthService } from '../auth/auth.service'; 
import { PrismaService } from 'nestjs-prisma';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthService,JwtService,CaslAbilityFactory,], 
})
export class UsersModule {}
