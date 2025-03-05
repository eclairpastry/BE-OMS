import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateRolesDto{
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    subrole_id?: number[] | null;

    @IsOptional()
    @IsArray()
    permission_id?: number[] | null;
}