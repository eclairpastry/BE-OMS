import { SetMetadata } from '@nestjs/common';

export const CaslAbility = (...permissions: string[]) => SetMetadata('permissions', permissions);

export const Subject = (subject: string) => SetMetadata('subject', subject);

export const Action = (action: string) => SetMetadata('action', action);