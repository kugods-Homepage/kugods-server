import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JoinMemberPayload } from './payload/join-member.payload';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
//import { LoginPayload } from './payload/login.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async joinEnrolledUser(payload: JoinMemberPayload) {
    const { email, password, studentId, accessCode } = payload;
    // 승인코드 확인
    if (this.userService.generateAccessCode(studentId) !== accessCode) {
      throw new UnauthorizedException({
        message: `승인코드가 학번과 일치하지 않습니다.`,
      });
    }

    // 기가입된 계정 오류 처리
    if (this.userRepository.getUserAccountByEmail(email)) {
      throw new ConflictException({
        message: `이미 가입된 이메일입니다.`,
      });
    }

    // userId 받아오기
    const { id: userId } = await this.userRepository.getUserByStudentId(studentId);
    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 12);
    // DB에 등록
    this.userRepository.joinEnrolledUser(userId, email, hashedPassword);
  }
}
