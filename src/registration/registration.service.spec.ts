import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let registration: RegistrationDto

  beforeEach(() => {
    // Create a mock PrismaService with jest.fn() for each method used.
    prismaService = {
      users: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;
    configService = {} as any;

    registrationService = new RegistrationService(prismaService, configService);
  });

  describe('registrationCA', () => {
    it('should create a new user when no conflict exists', async () => {
        const registration: RegistrationDto = {
            id: '1',
            nra: '123',
            nim: '456',
            role_id: 0,
            subrole_id: 0,
            nama: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            no_telp: '12345678',
            jenis_kelamin: 'MALE', // assuming Gender enum value
            agama: 'Islam',        // assuming Religion enum value
            image: 'default.png',
            fakultas: 'Engineering',
            program_studi: 'Computer Science',
            status: 'Active',      // assuming Status enum value
          };
      const file = { filename: 'image123.png', fieldname: 'users_image' } as Express.Multer.File;

      // Set up prisma.findFirst to simulate that no user exists
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue(null);

      // Spy on bcrypt.hash to return a hashed password
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      // Set BASE_URL environment variable for image URL creation
      process.env.BASE_URL = 'http://localhost:3000/';

      // Simulate the prisma.create call to return created user data
      (prismaService.users.create as jest.Mock).mockResolvedValue({
        id: '1',
        nim: registration.nim,
        nama: registration.nama,
        username: registration.username,
        email: registration.email,
        password: 'hashedPassword',
      });

      const result = await registrationService.registrationCA(registration, file);

      expect(prismaService.users.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { username: registration.username },
            { email: registration.email },
            { nim: registration.nim },
            { nra: registration.nra },
          ],
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(registration.password, 10);

      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: {
          ...registration,
          image: `${process.env.BASE_URL}uploads/users_image/${file.filename}`,
          nra: null,
          role_id: 7,
          password: 'hashedPassword',
        },
      });

      expect(result).toEqual({
        id: '1',
        nim: registration.nim,
        nama: registration.nama,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
        const registration: RegistrationDto = {
        id: '1',
        nra: '123',
        nim: '456',
        role_id: 0,
        subrole_id: 0,
        nama: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        no_telp: '12345678',
        jenis_kelamin: 'MALE',
        agama: 'Islam',
        image: 'default.png',
        fakultas: 'Engineering',
        program_studi: 'Computer Science',
        status: 'Active',
      };
      const file = { filename: 'image123.png', fieldname: 'users_image' } as Express.Multer.File;

      // Simulate an existing user found
      (prismaService.users.findFirst as jest.Mock).mockResolvedValue({
        id: 'existingId',
        username: registration.username,
        email: registration.email,
        nim: registration.nim,
        nra: registration.nra,
      });

      await expect(registrationService.registrationCA(registration, file))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('getAllCA', () => {
    it('should return a list of users with role_id 7', async () => {
      const users = [
        {
          id: '1',
          nim: '456',
          nama: 'Test User',
          jenis_kelamin: 'Male',
          program_studi: 'Computer Science',
        },
      ];

      (prismaService.users.findMany as jest.Mock).mockResolvedValue(users);

      const result = await registrationService.getAllCA();

      expect(prismaService.users.findMany).toHaveBeenCalledWith({
        where: { role_id: 7 },
        select: {
          id: true,
          nim: true,
          nama: true,
          jenis_kelamin: true,
          program_studi: true,
        },
      });

      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = { id: '1', nim: '456', nama: 'Test User' };

      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await registrationService.getUserById('1');

      expect(prismaService.users.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      (prismaService.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(registrationService.getUserById('1'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user data', async () => {
      const updateData = { nama: 'Updated Name' };
      const updatedUser = { id: '1', nama: 'Updated Name' };

      (prismaService.users.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await registrationService.updateUser('1', updateData);

      expect(prismaService.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should return true if deletion is successful', async () => {
      (prismaService.users.delete as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await registrationService.deleteUser('1');

      expect(prismaService.users.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(true);
    });

    it('should throw an error if deletion fails', async () => {
      (prismaService.users.delete as jest.Mock).mockRejectedValue(new Error('Deletion failed'));

      await expect(registrationService.deleteUser('1'))
        .rejects
        .toThrow('Failed to delete user: Deletion failed');
    });
  });
});
