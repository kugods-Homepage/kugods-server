import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { TestPayload } from './payload/test.payload';
import { TestDto } from './dto/test.dto';
import { TestType } from './types/test.type';
import * as XLSX from 'xlsx';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';
import { UserPosition } from './types/user-position.enum';
import { validate } from 'class-validator';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly config: ConfigService) {}

  async test(payload: TestPayload): Promise<TestDto> {
    // 필요한 경우 주입받은 userRepository를 사용하여 DB에 접근합니다.

    const data: TestType = {
      a: payload.a,
      b: payload.b ?? 'b',
      c: payload.c ?? 'c',
    };

    return TestDto.of(data);
  }

  async enrollByXlsx(file: Express.Multer.File): Promise<void> {
    // 엑셀 데이터 가져오기
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const xlsxRows = XLSX.utils.sheet_to_json(sheet, {
      defval: null, //defaultValue: null
    });

    // XLSX -> JSON DAO 형식으로 맞추기
    const generation = sheet['G3'].v;
    const xlsxEnrollData: XlsxEnrollDao[] = xlsxRows.map((row) => {
      const values = Object.keys(row).map((key) => row[key]);
      const [name, studentId, phone, xlsxPosition] = values;
      return new XlsxEnrollDao(name, studentId, phone, UserPosition[xlsxPosition], generation);
    });

    // validate DAO
    for (const data of xlsxEnrollData) {
      const validationError = await validate(data);
      if (validationError.length > 0) {
        const errorDetail = validationError.map((err) => err.constraints);

        throw new BadRequestException({
          statusCode: 400,
          message: `엑셀 파일의 정보가 틀렸거나 양식에 어긋납니다.`,
          error: 'Bad Request',
          description: errorDetail,
        });
      }
    }

    // DB 등록하기
    return this.userRepository.enroll(xlsxEnrollData);
  }

  async generateXlsxWithAccessCode(): Promise<string> {
    // DB에서 미가입된 유저들의 목록을 받아옴
    const userList = await this.userRepository.getNotJoinedUserList();
    console.log(userList);

    // 승인코드 생성
    const userAccessCodeList = userList.map((user) => {
      const { name, studentId, phone, position } = user;
      const accessCode = this.generateAccessCode(studentId);
      const convertedPhone = '0' + phone.substring(3);
      return { 이름: name, 학번: studentId, 전화번호: convertedPhone, 포지션: position, 승인코드: accessCode };
    });

    // 엑셀 파일 작성
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(userAccessCodeList);
    XLSX.utils.book_append_sheet(workBook, workSheet, '승인코드');
    workSheet['!cols'] = [{ wpx: 75 }, { wpx: 100 }, { wpx: 125 }, { wpx: 75 }, { wpx: 500 }];
    const xlsxFile = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'base64',
    });

    return xlsxFile;
  }

  generateAccessCode(studentId: number): string {
    return crypto
      .createHash('sha512')
      .update(studentId + this.config.get<string>('ACCESS_CODE_SALT'))
      .digest('hex');
  }
}
