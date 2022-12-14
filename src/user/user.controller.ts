import { Body, Controller, Get, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { TestDto } from './dto/test.dto';
import { TestPayload } from './payload/test.payload';
import { xlsxEnrollOption } from 'src/utils/multer/xlsx-enroll.option';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //예시입니다.
  @Post('test')
  @ApiOperation({ summary: 'test합니다.' })
  @ApiOkResponse({ type: TestDto })
  async test(@Body() payload: TestPayload): Promise<TestDto> {
    return this.userService.test(payload);
  }

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
    return this.userService.enrollByXlsx(file);
  }

  @ApiOperation({ summary: '유저들의 승인코드가 담긴 xlsx파일을 base64형태로 생성해서 내려줌' })
  @ApiOkResponse()
  @HttpCode(200)
  @Get('/access-code')
  async generateXlsxWithAccessCode(): Promise<string> {
    return this.userService.generateXlsxWithAccessCode();
  }
}
