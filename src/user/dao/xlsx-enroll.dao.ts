import { HttpException, HttpStatus } from '@nestjs/common';

export class XlsxEnrollDao {
  constructor(name: string, studentId: number, phone: string) {
    if (studentId >= 1000000000 && studentId <= 9999999999) {
      this.studentId = studentId;
    } else {
      throw new HttpException(
        {
          message: '학번 값이 잘못 되었습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.name = name;
    this.phone = phone;
  }

  setPosition(position: 'LEAD' | 'CORE' | 'MEMBER' | 'JUNIOR') {
    this.position = position;
  }

  public name: string;
  public studentId: number;
  public phone: string;
  public position: 'LEAD' | 'CORE' | 'MEMBER' | 'JUNIOR';
}
