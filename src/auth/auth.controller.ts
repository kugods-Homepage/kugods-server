import { Controller, Post, Body, HttpCode, Param, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinMemberPayload } from 'src/auth/payload/join-member.payload';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginPayload } from './payload/login.payload';
import { xlsxEnrollOption } from 'src/utils/multer/xlsx-enroll.option';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '합격자 정보가 담긴 엑셀 파일 업로드를 통해 서버에 정보 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post('/xlsx')
  @UseInterceptors(FileInterceptor('file', xlsxEnrollOption))
  async enrollByXlsx(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.authService.enrollByXlsx(file);
  }

  @ApiOperation({ summary: '유저들의 승인코드가 담긴 xlsx파일을 base64형태로 생성해서 내려줌' })
  @ApiOkResponse()
  @HttpCode(200)
  @Get('/access-code')
  async generateXlsxWithAccessCode(): Promise<string> {
    return this.authService.generateXlsxWithAccessCode();
  }

  @ApiOperation({ summary: '기등록된 회원을 회원가입 처리함' })
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post('/join')
  async joinEnrolledUser(@Body() payload: JoinMemberPayload): Promise<void> {
    return this.authService.joinEnrolledUser(payload);
  }

  @ApiOperation({ summary: '회원 로그인' })
  @ApiOkResponse()
  @HttpCode(200)
  @Post('/login')
  async login(@Body() payload: LoginPayload): Promise<LoginDto> {
    return this.authService.login(payload);
  }
}
