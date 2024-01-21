import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'

/**
 * @classdesc 为成功的Http响应数据统一添加 code、msg、success 字段
 */
@Injectable()
export class SuccessResponse<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<THttpSuccessResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return {
          code: 0,
          data,
          msg: '请求成功',
          success: true,
        }
      }),
    )
  }
}
