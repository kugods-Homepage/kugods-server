import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class JoinDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  public password: string;

  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  public studentId: number;

  @IsString()
  @IsNotEmpty()
  public accessCode: string;
}