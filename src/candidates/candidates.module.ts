import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { PrismaService } from 'nestjs-prisma';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService,PrismaService,CaslAbilityFactory,AuthService,JwtService],
})
export class CandidatesModule {}
