import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { FastifyRequest } from 'fastify/types/request'
import { getReqMainInfo } from '@/utils/helpers'

/**
 * @classdesc 为成功的Http响应数据统一添加 code、msg、success 字段
 */
@Injectable()
export class SuccessResponse<T> implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  /**
   * 了解执行上下文 ExecutionContext
   * https://nest.nodejs.cn/fundamentals/execution-context
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<THttpSuccessResponse<T>> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()

    return next.handle().pipe(
      map((data: T) => {
        this.logger.log(getReqMainInfo(req), 'SuccessResponse')
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
