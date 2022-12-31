import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JoinMemberPayload } from './payload/join-member.payload';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginPayload } from './payload/login.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async joinEnrolledUser(payload: JoinMemberPayload) {
    const { email, password, studentId, accessCode } = payload;
    // 승인코드 확인
    if (this.userService.generateAccessCode(studentId) !== accessCode) {
      throw new UnauthorizedException(`승인코드가 학번과 일치하지 않습니다.`);
    }

    // 기가입된 학번 오류 처리
    const exAccount = (await this.userService.getUserAccountByStudentId(studentId)).userAccount;
    if (exAccount) {
      throw new ConflictException(`이미 가입된 학번입니다.`);
    }

    // userId 받아오기
    const { id: userId } = await this.userService.getUserByStudentId(studentId);
    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 12);
    // DB에 등록
    this.userService.joinEnrolledUser(userId, email, hashedPassword);
  }

  async login(payload: LoginPayload) {
    const { email, password } = payload;

    // userAccount 받아오기 및 유저 확인
    const userAccount = await this.userService.getUserAccountByEmail(email);
    if (!userAccount) {
      throw new NotFoundException(`존재하지 않는 이메일입니다.`);
    }

    // 패스워드 확인
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
}
