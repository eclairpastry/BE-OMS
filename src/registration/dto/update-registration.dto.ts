import { PartialType } from '@nestjs/mapped-types';
import { RegistrationDto } from './registration.dto';

export class UpdateRegistrationDto extends PartialType(RegistrationDto) {}
