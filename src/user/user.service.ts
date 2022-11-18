import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TestPayload } from './payload/test.payload';
import { TestDto } from './dto/test.dto';
import { TestType } from './types/test.type';
import * as XLSX from 'xlsx';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async test(payload: TestPayload): Promise<TestDto> {
    // 필요한 경우 주입받은 userRepository를 사용하여 DB에 접근합니다.

    const data: TestType = {
      a: payload.a,
      b: payload.b ?? 'b',
      c: payload.c ?? 'c',
    };

    return TestDto.of(data);
  }

  async enrollByXlsx(file: Express.Multer.File) {
    console.log(file);

    //첫 번째 시트에 접근
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    //엑셀 데이터 가져오기
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: null, //defaultValue: null
    });

    for (const row of rows) {
      //DB에 등록
      console.log('1 row', row);
      //const values = Object.keys(row).map((key) => row[key]);
      //const [name, studentId, phone, position] = values;
      //this.userRepository.enroll();
    }

    return true;
  }
}
