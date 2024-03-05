import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  GatewayTimeoutException,
} from '@nestjs/common'
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs'

/**
 * 您想要处理路线请求的超时。当您的端点在一段时间后没有返回任何内容时，
 * 您希望以错误响应终止。以下结构可实现此目的
 * 10s 超时
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutInMillis: number) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutInMillis),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new GatewayTimeoutException('网关超时～')
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => err)
      }),
    )
  }
}
