import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';

export class CheckEmailPayload {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  public email!: string;
}
