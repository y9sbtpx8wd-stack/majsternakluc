import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) throw new UnauthorizedException();

    const token = auth.replace('Bearer ', '');

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
