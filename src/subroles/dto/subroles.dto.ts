import { Permission, Sub_Role, Role } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class getSubRolesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  subrole_id: number;

  @IsOptional()
  @IsArray()
  permission_id?: Permission[];
}

export class createSubRolesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  role_id: number;

  @IsOptional()
  @IsArray()
  permissions_id?: number[];
}

export class updateSubRolesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsNumber()
  // @IsNotEmpty()
  role_id: number;

  @IsOptional()
  @IsArray()
  permissions_id?: number[];
}
