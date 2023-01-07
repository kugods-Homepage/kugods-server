import {
  BadRequestException,
  ConflictException,
  ConsoleLogger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { LoginPayload } from './payload/login.payload';
import { JoinMemberPayload } from './payload/join-member.payload';
import { XlsxEnrollDao } from './dao/xlsx-enroll.dao';
import { UserPosition } from './types/user-position.enum';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { CheckEmailPayload } from './payload/check-email.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

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
    return this.authRepository.enroll(xlsxEnrollData);
  }

  async generateXlsxWithAccessCode(): Promise<string> {
    // DB에서 미가입된 유저들의 목록을 받아옴
    const userList = await this.authRepository.getNotJoinedUserList();

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

  async joinEnrolledUser(payload: JoinMemberPayload) {
    const { email, password, studentId, accessCode } = payload;
    // 승인코드 및 기가입 학번 확인
    if (this.generateAccessCode(studentId) !== accessCode) {
      throw new UnauthorizedException(`승인코드가 학번과 일치하지 않습니다.`);
    }
    const exAccount = (await this.authRepository.getUserAccountByStudentId(studentId)).userAccount;
    if (exAccount) {
      throw new ConflictException(`이미 가입된 학번입니다.`);
    }

    // DB에 등록
    const { id: userId } = await this.authRepository.getUserByStudentId(studentId);

    const salt = await bcrypt.genSalt(this.config.get<number>('BCRYPT_SALT_ROUND'));
    const hashedPassword = await bcrypt.hash(password, salt);
    this.authRepository.joinEnrolledUser(userId, email, hashedPassword);
  }

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    // 이메일 및 비밀번호 확인
    const userAccount = await this.authRepository.getUserAccountByEmail(email);
    if (!userAccount) {
      throw new NotFoundException(`존재하지 않는 이메일입니다.`);
    }
    const isMachted = await bcrypt.compare(password, userAccount.password);
    if (!isMachted) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    // JWT 토큰 발행
    const accessToken = this.jwtService.sign({
      email: userAccount.email,
    });
    return { accessToken };
  }

  async checkEmailDuplicate(payload: CheckEmailPayload): Promise<void> {
    const { email } = payload;
    const exUser = await this.authRepository.getUserAccountByEmail(email);
    if (exUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
  }

  generateAccessCode(studentId: number): string {
    return crypto
      .createHash('sha512')
      .update(studentId + this.config.get<string>('ACCESS_CODE_SALT'))
      .digest('hex');
  }
}
