import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
