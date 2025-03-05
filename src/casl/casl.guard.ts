import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const ability: Ability = await this.caslAbilityFactory.createForUser(token);

    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true; 
    }

    const subject = this.reflector.get<string>('subject', context.getHandler());
    const action = this.reflector.get<string>('action', context.getHandler());

    if (!ability.can(action, subject)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
