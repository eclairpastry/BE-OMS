import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
  imports: [JwtModule.register({})],
  controllers: [RegistrationController],
  providers: [RegistrationService, PrismaService, AuthService,JwtService,CaslAbilityFactory,],
})
export class RegistrationModule {}
