import { Controller, Post, Body, HttpCode, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JoinMemberPayload } from 'src/auth/payload/join-member.payload';
import { AuthService } from './auth.service';
//import { LoginPayload } from './payload/login.payload';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '기등록된 회원을 회원가입 처리함' })
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post('/join')
  async joinEnrolledUser(@Body() payload: JoinMemberPayload) {
    return this.authService.joinEnrolledUser(payload);
  }
}
