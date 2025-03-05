import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  PrismaModule,
  PrismaService,
} from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { OpenRecruitmentModule } from './open-recruitment/open-recruitment.module';
import { UsersModule } from './users/users.module';
import { SubrolesModule } from './subroles/subroles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';
import { AtGuard } from './common/guards';
import { AuthModule } from './auth/auth.module';
import { CaslAbilityGuard } from './casl/casl.guard';
import { CandidatesModule } from './candidates/candidates.module';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule.forRoot(),
    RolesModule,
    SubrolesModule,
    OpenRecruitmentModule,
    UsersModule,
    PermissionsModule,
    CandidatesModule,
    RegistrationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
