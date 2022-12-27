import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  providers: [AuthService, UserService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
