import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/services/prisma.service';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';
import { JoinDto } from './dto/join.dto';

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

  async getUserIdByStudentId(studentId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        studentId,
      },
    });
  }

  /*
  async joinEnrolledUser(email: string, password: string) {
    return this.prisma.userAccount.create({
      data: {
        user: 
        email,
        password,
      },
    });
  }
  */
}
