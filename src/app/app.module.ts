import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { configModule } from './modules/config.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CommonModule, UserModule, configModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
