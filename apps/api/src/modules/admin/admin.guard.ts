import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // ak user neexistuje → nepustiť
    if (!req.user) return false;

    // ak role nie je ADMIN → nepustiť
    return req.user.role === 'ADMIN';
  }
}
