import { Module } from '@nestjs/common';
import { SubrolesService } from './subroles.service';
import { SubrolesController } from './subroles.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [SubrolesService, PrismaService],
  controllers: [SubrolesController],
})
export class SubrolesModule {}
