import { Gender, Religion, Role, Status } from '@prisma/client';
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class RegistrationDto {
    id: string;
    nra: string;

    @IsNotEmpty({ message: 'NIM tidak boleh kosong' })
    @IsString({ message: 'NIM harus berupa string' })
    nim: string;
    
    @IsOptional()
    role_id: number;
    
    @IsOptional()
    subrole_id: number;


    @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
    @IsString({ message: 'Nama harus berupa string' })
    nama: string;

    @IsOptional()
    username: string;

    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    @IsString({ message: 'Email harus berupa string' })
    email: string;

    @IsOptional()
    password: string;

    @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
    @IsString({ message: 'Nomor telepon harus berupa string' })
    @Length(8, 14, { message: 'Nomor telepon harus memiliki panjang antara 8 dan 14 karakter' })
    no_telp: string;

    @IsNotEmpty({ message: 'Jenis kelamin tidak boleh kosong' })
    @IsEnum(Gender)
    jenis_kelamin: Gender;

    @IsNotEmpty({ message: 'Agama tidak boleh kosong' })
    @IsEnum(Religion)
    agama: Religion;

    @IsNotEmpty({ message: 'Image tidak boleh kosong' })
    @IsString({ message: 'Email harus berupa string' })
    image: string;

    @IsNotEmpty({ message: 'Fakultas tidak boleh kosong' })
    @IsString({ message: 'Fakultas harus berupa string' })
    fakultas: string;

    @IsNotEmpty({ message: 'Program studi tidak boleh kosong' })
    @IsString({ message: 'Program studi harus berupa string' })
    program_studi: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;
  
}
