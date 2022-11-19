import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(dao: XlsxEnrollDao) {
    await this.prisma.user
      .create({
        data: {
          name: dao.name,
          phone: dao.phone,
          studentId: dao.studentId,
          position: dao.position,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
