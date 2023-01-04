import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (!user.isAdmin || !user.isActive) {
      throw new ForbiddenException('현재 활동중인 쿠갓즈 운영진만 가능한 기능입니다.');
    }
    return true;
  }
}
