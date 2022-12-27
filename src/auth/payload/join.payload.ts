import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class JoinPayload {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ type: String })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public password!: string;

  @ApiProperty({ type: Number })
  @IsDefined()
  @IsNumber()
  @Min(1000000000)
  @Max(9999999999)
  public studentId!: number;

  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public accessCode!: string;
}
