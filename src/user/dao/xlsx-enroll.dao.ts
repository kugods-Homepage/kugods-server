import { UserPosition } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Max, Min } from 'class-validator';

// 프론트나 API 명세에 들어가는 내용이 아니므로 swagger는 생략
export class XlsxEnrollDao {
  constructor(name: string, studentId: number, phone: string, position: UserPosition) {
    this.name = name;
    this.studentId = studentId;
    this.phone = '+82' + phone.substring(1);
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

  @IsString()
  @IsNotEmpty()
  public position: UserPosition;
}
