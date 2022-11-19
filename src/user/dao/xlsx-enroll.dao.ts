import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class XlsxEnrollDao {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  public studentId: number;

  @IsPhoneNumber()
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public position: 'LEAD' | 'CORE' | 'MEMBER' | 'JUNIOR';
}
