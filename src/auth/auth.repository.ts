import { Injectable } from '@nestjs/common';
import { User, UserAccount } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(data: XlsxEnrollDao[]): Promise<void> {
    await this.prisma.user.createMany({ data: data, skipDuplicates: true });
  }

  async getNotJoinedUserList(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        userAccount: null,
      },
    });
  }

  async getUserByStudentId(studentId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        studentId,
      },
    });
  }

  async getUserAccountByStudentId(studentId: number): Promise<User & { userAccount: UserAccount }> {
    return this.prisma.user.findUnique({
      where: {
        studentId,
      },
      include: {
        userAccount: true,
      },
    });
  }

  async getUserAccountByEmail(email: string): Promise<UserAccount> {
    return this.prisma.userAccount.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return (
      await this.prisma.userAccount.findUnique({
        where: {
          email,
        },
        select: {
          user: true,
        },
      })
    ).user;
  }

  async joinEnrolledUser(userId: string, email: string, password: string): Promise<UserAccount> {
    return this.prisma.userAccount.create({
      data: {
        userId,
        email,
        password,
      },
    });
  }
}
