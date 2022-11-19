import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TestPayload } from './payload/test.payload';
import { TestDto } from './dto/test.dto';
import { TestType } from './types/test.type';
import * as XLSX from 'xlsx';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';

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
    console.log(rows);

    for (const row of rows) {
      //DAO 형식으로 맞추기
      const values = Object.keys(row).map((key) => row[key]);
      const [name, studentId, phone, xlsxPosition] = values;

      const xlsxEntrollDao = new XlsxEnrollDao(name, studentId, phone);

      if (xlsxPosition === '리드') xlsxEntrollDao.setPosition('LEAD');
      else if (xlsxPosition === '코어') xlsxEntrollDao.setPosition('CORE');
      else if (xlsxPosition === '멤버') xlsxEntrollDao.setPosition('MEMBER');
      else if (xlsxPosition === '주니어') xlsxEntrollDao.setPosition('JUNIOR');

      console.log(xlsxEntrollDao);

      //DB 등록하기
      this.userRepository.enroll(xlsxEntrollDao);
    }

    return true;
  }
}
