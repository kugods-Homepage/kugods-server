import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinDto } from 'src/auth/dto/join.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '기등록된 회원들을 회원가입 처리함' })
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post('/join')
  async joinEnrolledUser(@Body() joinDto: JoinDto) {
    return this.authService.joinEnrolledUser(joinDto);
  }
}
