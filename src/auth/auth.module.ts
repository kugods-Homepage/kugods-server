import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('JWT_TOKEN_EXPIRE'),
        },
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
