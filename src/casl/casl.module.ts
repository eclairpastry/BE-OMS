import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from '../auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { CaslAbilityGuard } from './casl.guard';


@Module({
  providers: [PrismaService, CaslAbilityFactory,AuthService,
    {
    provide: APP_GUARD,
    useClass: CaslAbilityGuard,
    },
  ],
  exports: [CaslAbilityFactory],
})
export class CaslAbilityModule {}
