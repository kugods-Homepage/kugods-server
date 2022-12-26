import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinPayload } from 'src/auth/payload/join.payload';
import { AuthService } from './auth.service';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '기등록된 회원들을 회원가입 처리함' })
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post('/join')
  async joinEnrolledUser(@Body() payload: JoinPayload) {
    return this.authService.joinEnrolledUser(payload);
  }
}
