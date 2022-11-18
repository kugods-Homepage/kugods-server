import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { TestDto } from './dto/test.dto';
import { TestPayload } from './payload/test.payload';
import { memoryStorage } from 'multer';

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

  @ApiOperation({
    summary: '합격자 정보가 담긴 엑셀 파일 업로드를 통해 서버에 정보 등록',
  })
  @Post('/xlsx')
  @UseInterceptors(
    FileInterceptor('file', {
      //파일 확장자 처리
      fileFilter: (request, file, callback) => {
        console.log('fileFilter...');
        if (file.mimetype.match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              {
                error: '.xlsx파일을 업로드해주세요.',
              },
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      //메모리에 저장
      storage: memoryStorage(),
    }),
  )
  async enrollByXlsx(@UploadedFile() file: Express.Multer.File) {
    return this.userService.enrollByXlsx(file);
  }
}
