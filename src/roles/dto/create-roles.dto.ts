import { Permission, Sub_Role } from "@prisma/client";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRolesDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsArray()
    subrole_id?: Sub_Role[];

    @IsOptional()
    @IsArray()
    permission_id?: Permission[];
}