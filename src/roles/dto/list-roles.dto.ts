import { Permission, Sub_Role } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class ListRolesDto {
    @IsString()
    name: string;

    @IsOptional()
    subrole_id?: Sub_Role[];

    @IsOptional()
    permission_id?: Permission[]
}
