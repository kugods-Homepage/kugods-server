import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsEmail } from 'class-validator';

export class LoginPayload {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  @IsEmail()
  public email!: string;

  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  public password!: string;
}
