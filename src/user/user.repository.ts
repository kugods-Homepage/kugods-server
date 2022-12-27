import { Injectable } from '@nestjs/common';
import { User, UserAccount } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';

@Injectable()
export class UserRepository {
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

  async getUserAccountByEmail(email: string): Promise<UserAccount> {
    return this.prisma.userAccount.findUnique({
      where: {
        email,
      },
    });
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
