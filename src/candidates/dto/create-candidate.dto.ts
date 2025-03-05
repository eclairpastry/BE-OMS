import { Approval } from "@prisma/client";
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { isFloat32Array } from "util/types";

export class CreateCandidateDto {
    
    user_id: string;

    @IsNotEmpty()
    @IsNumber()
    lk1: number;
  
    @IsNotEmpty()
    @IsNumber()
    lk2: number;
  
    @IsNotEmpty()
    @IsNumber()
    sc: number;
  
    @IsNotEmpty()
    @IsNumber()
    keaktifan: number;
}
