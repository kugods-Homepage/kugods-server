import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//https://github.com/nestjs/passport/blob/6d9c71fa04e5c16480ba0b7e7671e43918dd9ff4/lib/auth.guard.ts
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('유효한 인증 정보가 아닙니다.');
    }
    return user;
  }
}
