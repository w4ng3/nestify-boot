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
import { Reflector } from '@nestjs/core/services/reflector.service'
import { SKIP_INTERCEPTOR } from '@/config'

/**
 * @classdesc 为成功的Http响应数据统一添加 code、msg、success 字段
 */
@Injectable()
export class SuccessResponse<T> implements NestInterceptor {
  private readonly reflector: Reflector = new Reflector()

  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  /**
   * 了解执行上下文 ExecutionContext
   * https://nest.nodejs.cn/fundamentals/execution-context
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<THttpSuccessResponse<T>> | Observable<T> {
    // 获取请求信息，并记录日志
    const req = context.switchToHttp().getRequest<FastifyRequest>()
    this.logger.log(getReqMainInfo(req), 'SuccessResponse')

    // 获取当前请求是否需要跳过此拦截器
    const skipInterceptor = this.reflector.get<boolean>(SKIP_INTERCEPTOR, context.getHandler())
    if (skipInterceptor) {
      return next.handle()
    }

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
