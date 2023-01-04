import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTokenType } from '../types/jwt-token.type';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService, private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(jwtToken: JwtTokenType): Promise<any> {
    const { email } = jwtToken;
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('JWT 토큰이 유효하지 않습니다.');
    }
    return user;
  }
}
