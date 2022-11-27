import { BadRequestException } from '@nestjs/common';
import { UserPosition } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, Min } from 'class-validator';

export class XlsxEnrollDao {
  constructor(name: string, studentId: number, phone: string, position: UserPosition) {
    this.name = name;
    this.studentId = studentId;
    if (typeof phone !== 'string') {
      throw new BadRequestException('핸드폰 번호가 양식에 맞지 않습니다.');
    } else {
      this.phone = '+82' + phone.substring(1);
    }
    this.position = position;
  }

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  public studentId: number;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  public phone: string;

  @IsEnum(UserPosition)
  @IsNotEmpty()
  public position: UserPosition;
}
