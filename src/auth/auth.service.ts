import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JoinPayload } from './payload/join.payload';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly userService: UserService) {}

  async joinEnrolledUser(payload: JoinPayload) {
    const { email, password, studentId, accessCode } = payload;
    // 승인코드 확인
    if (this.userService.generateAccessCode(studentId) !== accessCode) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: `승인코드가 학번과 일치하지 않습니다.`,
        error: 'Unauthorized',
      });
    }

    // userId 받아오기
    const { id: userId } = await this.userRepository.getUserIdByStudentId(studentId);

    // password 암호화
    const hashedPassword = await bcrypt.hash(password, 12);

    // DB에 등록
    return this.userRepository.joinEnrolledUser(userId, email, hashedPassword);
  }
}
