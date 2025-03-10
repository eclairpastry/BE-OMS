import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService],
})
export class PermissionsModule {}
