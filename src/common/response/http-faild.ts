import { getReqMainInfo } from '@/utils/helpers'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

/**
 * @class HttpFaild
 * @classdesc 拦截全局抛出的 HttpException 异常，同时任何错误将在这里被规范化输出
 * 参考自 https://nest.nodejs.cn/exception-filters#异常过滤器-1
 */
@Catch(HttpException)
// 接口异常拦截器
export class HttpFaild implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()
    const resp = exception.getResponse()
    const status = exception.getStatus()
    let msg: string | string[]

    if (typeof resp === 'string') {
      msg = resp
    } else if (typeof resp === 'object') {
      // resp 若为 object，则通常包含两个属性：statusCode 和 message，还有一个可选的属性 error
      msg = resp['message']
      // 未通过class-validator验证的错误信息会以数组的形式返回，这里将其转换为字符串
      if (Array.isArray(msg)) {
        msg = msg.join(';')
      }
      // 从 object 中取出 statusCode,如果没有则使用 HttpException 的默认状态码
      // status = resp['statusCode'] || status
    }
    // exception.stack 为错误堆栈信息，但是内容太多，这里只打印错误信息和请求信息
    // this.logger.error(msg, exception.stack, 'HttpFaild')
    this.logger.error(msg, getReqMainInfo(request), 'HttpFaild')

    const data: THttpErrorResponse = {
      code: status,
      path: request.url,
      time: new Date(),
      msg,
      success: false,
    }

    void response.code(status).send(data)
  }
}
