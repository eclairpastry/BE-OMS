import { Injectable } from '@nestjs/common';
import { CreateOpenRecruitmentDto } from './dto/create-open-recruitment.dto';
import { Gender, Religion, Status } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';


@Injectable()
export class OpenRecruitmentService {
  constructor(private prisma: PrismaService) {}

  async isNimUnique(nim: string): Promise<boolean> {
    const user = await this.prisma.users.findFirst({
        where: {
            nim: nim
        }
    });
    return user ? false : true;
  }

  async create(createOpenRecruitmentDto: CreateOpenRecruitmentDto) {
    try {
      // ID
      createOpenRecruitmentDto.id = randomUUID();

      // NRA
      createOpenRecruitmentDto.nra = null;

      // NIM
      const isNimUnique = await this.isNimUnique(createOpenRecruitmentDto.nim);
        if (!isNimUnique) {
            throw new Error('NIM sudah digunakan');
        }
      createOpenRecruitmentDto.nim = createOpenRecruitmentDto.nim;


      // Role
      const id_role_val = await this.prisma.role.findFirst({
        where: {
          name: "Calon Anggota"
        },
      });

      if (!id_role_val) {
        throw new Error('Role "Calon Anggota" tidak ditemukan');
      }
      createOpenRecruitmentDto.role_id = id_role_val.id;

      // Subrole
      createOpenRecruitmentDto.subrole_id = null;

      // Username
      if (!createOpenRecruitmentDto.username) {
        let words = createOpenRecruitmentDto.nama.split(' ');
        let abbreviatedName = '';
        if (words.length === 1) {
          abbreviatedName = createOpenRecruitmentDto.nama.toLowerCase();
        } else {
          for (let i = 0; i < words.length - 1; i++) {
            abbreviatedName += words[i].charAt(0);
          }
          abbreviatedName += words[words.length - 1];
          abbreviatedName = abbreviatedName.toLowerCase();
        }
        createOpenRecruitmentDto.username = abbreviatedName;

        let validateUsername = await this.prisma.users.findFirst({
          where: {
            username: createOpenRecruitmentDto.username
          }
        });
        if (validateUsername) {
          const usernameRandom = Math.floor(Math.random() * 1000);
          createOpenRecruitmentDto.username = createOpenRecruitmentDto.username + usernameRandom;
        }
      }

      // Password
      const password = createOpenRecruitmentDto.id.substr(0, 8);
      const hashedPassword = await bcrypt.hash(password, 10);
      createOpenRecruitmentDto.password = hashedPassword;

      // No Telp

      // Jenis Kelamin
      createOpenRecruitmentDto.jenis_kelamin = Gender[createOpenRecruitmentDto.jenis_kelamin];

      // Agama
      createOpenRecruitmentDto.agama = Religion[createOpenRecruitmentDto.agama];

      // Status
      createOpenRecruitmentDto.status = Status.Active;

      // Fakultas

      // Prodi

      // Membuat pengguna baru
      const newUser = await this.prisma.users.create({
        data: {
          id:createOpenRecruitmentDto.id,
          nra:null,
          nim: createOpenRecruitmentDto.nim,
          role_id: createOpenRecruitmentDto.role_id,
          subrole_id:null,
          nama: createOpenRecruitmentDto.nama,
          username: createOpenRecruitmentDto.username,
          email: createOpenRecruitmentDto.email,
          password: createOpenRecruitmentDto.password,
          no_telp: createOpenRecruitmentDto.no_telp,
          jenis_kelamin: createOpenRecruitmentDto.jenis_kelamin,
          agama: createOpenRecruitmentDto.agama,
          image: createOpenRecruitmentDto.image,
          fakultas: createOpenRecruitmentDto.fakultas,
          program_studi: createOpenRecruitmentDto.program_studi,
          status: createOpenRecruitmentDto.status
        }
      });

      return newUser;
    } catch (error) {
      throw new Error(`Failed to registration - ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.users.findMany({
      where: {
        role_id: 2
      }
    });
  }
}
