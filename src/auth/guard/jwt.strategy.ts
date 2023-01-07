import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenData } from '../types/jwt-token.type';
import { AuthRepository } from '../auth.repository';
import { RequestUserType } from '../types/request-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService, private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(jwtToken: TokenData): Promise<RequestUserType> {
    const { email } = jwtToken;
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
