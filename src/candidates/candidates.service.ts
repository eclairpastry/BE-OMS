import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { PrismaService } from 'nestjs-prisma';
import { Approval, Candidate } from '@prisma/client';
import { ApprovalCandidateDto } from './dto/approval-candidate.dto';
import * as bcrypt from 'bcrypt';

import { sendMail } from '../common/config/mailer.config';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CandidatesService {
  private transporter: nodemailer.Transporter;
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.transporter = sendMail(this.config);
  }

  async createCandidate(createCandidateDto: CreateCandidateDto, userId: string): Promise<Candidate> {
    const existingCandidate = await this.prisma.candidate.findFirst({
      where: {
        user_id: userId,
      },
    });

    const { lk1, lk2, sc, keaktifan } = createCandidateDto;
    const rerata = (lk1 + lk2 + sc + keaktifan) / 4;
    const candidateData = { ...createCandidateDto, rerata, user_id: userId };

    console.log(candidateData)


    if (existingCandidate) {
      const updatedCandidate = await this.prisma.candidate.update({
        where: {
          id: existingCandidate.id,
        },
        data: candidateData,
      });

      const datas = await this.prisma.candidate.findFirst({
        where: {
          user_id: userId,
        },
      });

      return datas
    } else {
      const newCandidate = await this.prisma.candidate.create({
        data: candidateData,
      });
      return newCandidate;
    }
  } 
  
  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const candidate = await this.prisma.candidate.findFirst({
        where: {
          user_id: id,
        }
      });
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }
      return candidate;
    } catch (error) {
      throw new Error(`Failed to fetch candidate: ${error.message}`);
    }
  }

  async getAllCandidate(): Promise<any[]> {
    try {
      const candidates = await this.prisma.candidate.findMany({
        include: {
          user: true,
        },
      });
      return candidates.map((candidate) => ({
        id: candidate.id,
        user_id: candidate.user_id,
        lk1: candidate.lk1,
        lk2: candidate.lk2,
        sc: candidate.sc,
        keaktifan: candidate.keaktifan,
        rerata: candidate.rerata,
        approval: candidate.approval,
        description: candidate.description,
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching candidate list');
    }
  }

  async decisionCandidate(approvalCandidateDto: ApprovalCandidateDto, userId: string): Promise<Candidate> {
    try {
      if (approvalCandidateDto.approval === Approval.Accepted) {
        const existingCandidate = await this.prisma.candidate.findFirst({
          where: {
            user_id: userId,
          },
        });
    
        // Update tables users
        // NRA

        const nranow = await this.generateNRA();
    
        // Role (Anggota)
        const role = 6
    
        // Username
        const users = await this.prisma.users.findFirst({ where: { id: userId } });
        if (!users.username) {
          let words = users.nama.split(' ');
          let abbreviatedName = '';
          if (words.length === 1) {
            abbreviatedName = users.nama.toLowerCase();
          } else {
            for (let i = 0; i < words.length - 1; i++) {
              abbreviatedName += words[i].charAt(0);
            }
            abbreviatedName += words[words.length - 1];
            abbreviatedName = abbreviatedName.toLowerCase();
          }
          users.username = abbreviatedName;
    
          let validateUsername = await this.prisma.users.findFirst({
            where: {
              username: users.username
            }
          });
          if (validateUsername) {
            const usernameRandom = Math.floor(Math.random() * 1000);
            users.username = users.username + usernameRandom;
          }
        }
    
        // Password
        const password = users.id.substring(0, 8);
        const hashedPassword = await bcrypt.hash(password, 10);
        users.password = hashedPassword;
    
        users.nra = nranow
        users.role_id = role
    
        const updateUsers = await this.prisma.users.update({
          where: {
            id: userId
          },
          data: users
        })
  
        const updateCandidte = await this.prisma.candidate.findFirst({
          where: {
              user_id: userId,
          },
        });

        await this.prisma.candidate.update({
          where: {
            id: updateCandidte.id,
          },
          data: {
            approval : Approval.Accepted,
            description: approvalCandidateDto.description
          }
        })
    
        await this.sendAcceptedEmail(userId,password);
        return
      } else {
        const updateCandidte = await this.prisma.candidate.findFirst({
          where: {
              user_id: userId,
          },
        });
        await this.prisma.candidate.update({
          where: {
            id: updateCandidte.id,
          },
          data: {
            approval : Approval.Rejected,
            description: approvalCandidateDto.description
          }
        })
        await this.prisma.users.update({
          where: {
            id: userId,
          },
          data: {
            status: "Inactive",
          }
        })
        await this.sendRejectedEmail(userId);
      }
    } catch (error) {
      throw new Error(`Failed to process candidate approval: ${error.message}`);
    }
  }

  async sendAcceptedEmail(userId: string, password:string): Promise<void> {
    try {
        const user = await this.prisma.users.findUnique({
          where: { id: userId },
          select: {
              email: true,
              nra: true,
              nama: true,
              role: { select: { name: true } },
              username: true,
              password: true
            }
        });

        console.log("user email : ",user)
        const passwordEmail = process.env.password_email;
        console.log("password_dari env : ",passwordEmail)

        if (!user) {
          throw new Error('User not found');
        }
        const mailOptions = {
          from: 'ukmik@utdi.ac.id',
          to: user.email,
          subject: 'Congratulations! Your Application Has Been Approved',
          
          text: `Dear ${user.nama},\n\n` +
              `Congratulations! Your application has been approved.\n\n` +
              `NRA: ${user.nra}\n` +
              `Name: ${user.nama}\n` +
              `Role: ${user.role.name}\n` +
              `Username: ${user.username}\n` +
              `Password: ${password}\n\n` +
              `Please use the above credentials to log in and access your account.\n\n` +
              `Regards,\nUKM IK Student Committee`
        };
        await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendRejectedEmail(userId: string): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        nama: true,
        email: true,
        }
      });
      if (!user) {
        throw new Error('User not found');
      }
      const mailOptions = {
        from: 'ukmik@utdi.ac.id',
        to: user.email,
        subject: 'Important Update: Your Application Has Been Rejected ',
        text: `Dear ${user.nama},\n\n`+
        `We regret to inform you that your application has been rejected.\n\nThank you for your interest.\n\n`+
        `Regards,\nUKM IK Student Committee`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async generateNRA(): Promise<string> {
    // Retrieve all records with an NRA
    const nraData = await this.prisma.users.findMany({ select: { nra: true } });
  
    // Compute the maximum numeric part (first segment) among existing records
    const maxNRA = nraData.reduce((max, current) => {
      if (current.nra) {
        const parts = current.nra.split('/');
        const numericPart = parseInt(parts[0]);
        if (!isNaN(numericPart) && numericPart > max) {
          max = numericPart;
        }
      }
      return max;
    }, 0);
  
    const nraLatest = maxNRA + 1;
    const now = new Date();
    const currentYear = now.getFullYear().toString();
  
    // Find the last record based on the numeric part of the NRA.
    const lastRecord = nraData.reduce((prev, current) => {
      if (!current.nra) return prev;
      const parts = current.nra.split('/');
      const currentNum = parseInt(parts[0]);
      if (!prev) {
        return current;
      }
      const prevNum = parseInt(prev.nra.split('/')[0]);
      return currentNum > prevNum ? current : prev;
    }, null as { nra: string } | null);
  
    let newRoman: string;
    if (lastRecord && lastRecord.nra) {
      const parts = lastRecord.nra.split('/');
      const lastRoman = parts[2] || "I";
      const lastYear = parts[3] || "";
      if (lastYear === currentYear) {
        // If the last record is from the same year, reuse its Roman numeral.
        newRoman = lastRoman;
      } else {
        // If the year has changed, increment the Roman numeral.
        newRoman = this.toRoman(this.fromRoman(lastRoman) + 1);
      }
    } else {
      // If no records exist, start with the default Roman numeral "I"
      newRoman = "I";
    }
  
    const nranow = `${nraLatest}/UKM_IK/${newRoman}/${currentYear}`;
    return nranow;
  }
  
  // Converts a Roman numeral string to its numeric value.
  private fromRoman(roman: string): number {
    const romanNumerals: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let num = 0;
    let prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
      const current = romanNumerals[roman[i].toUpperCase()] || 0;
      if (current < prev) {
        num -= current;
      } else {
        num += current;
      }
      prev = current;
    }
    return num;
  }
  
  // Converts a number to its Roman numeral representation.
  private toRoman(num: number): string {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];
    let roman = '';
    for (const { value, numeral } of romanNumerals) {
      while (num >= value) {
        roman += numeral;
        num -= value;
      }
    }
    return roman;
  }
  
}

