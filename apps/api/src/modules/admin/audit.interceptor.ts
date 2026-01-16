import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const user = req.user;
    const path = req.route?.path;
    const method = req.method;

    return next.handle().pipe(
      tap(async (result) => {
        if (!user) return;

        await this.audit.log(user.id, 'ADMIN_API_CALL', {
          method,
          path,
          resultPreview: result && typeof result === 'object'
            ? Object.keys(result).slice(0, 5)
            : result,
        });
      }),
    );
  }
}
