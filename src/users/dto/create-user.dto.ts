import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsArray,
  Length,
} from 'class-validator';
import { Gender, Religion, Status } from '@prisma/client';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  nra: string;

  @IsString()
  @IsNotEmpty()
  nim: string;

  @IsOptional()
  role_id: number;

  @IsOptional()
  @IsArray()
  subrole_id: number;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  @IsString({ message: 'Nomor telepon harus berupa string' })
  @Length(8, 14, {
    message: 'Nomor telepon harus memiliki panjang antara 8 dan 14 karakter',
  })
  no_telp: string;

  @IsEnum(Gender)
  jenis_kelamin: Gender;

  @IsEnum(Religion)
  agama: Religion;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  @IsNotEmpty()
  fakultas: string;

  @IsString()
  @IsNotEmpty()
  program_studi: string;

  @IsEnum(Status)
  status: Status;
}
