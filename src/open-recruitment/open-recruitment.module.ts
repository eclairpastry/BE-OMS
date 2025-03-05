import { Module } from '@nestjs/common';
import { OpenRecruitmentService } from './open-recruitment.service';
import { OpenRecruitmentController } from './open-recruitment.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [OpenRecruitmentController],
  providers: [OpenRecruitmentService, PrismaService],
})
export class OpenRecruitmentModule {}
