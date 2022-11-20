import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(data: XlsxEnrollDao[]): Promise<void> {
    await this.prisma.user.createMany({ data: data, skipDuplicates: true });
  }
}
