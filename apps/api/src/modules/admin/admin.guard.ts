import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) return false;

    // ADMIN alebo SUPERADMIN
    return user.role === 'ADMIN' || user.role === 'SUPERADMIN';
  }
}

