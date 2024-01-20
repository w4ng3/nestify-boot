import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * @class HttpFaild
 * @classdesc 拦截全局抛出的 HttpException 异常，同时任何错误将在这里被规范化输出
 * 参考自 https://nest.nodejs.cn/exception-filters#异常过滤器-1
 */
@Catch(HttpException)
// 接口异常拦截器
export class HttpFaild implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    let msg = exception.getResponse();
    if (typeof msg === 'object') {
      msg = msg['message'];
      // 未通过class-validator验证的错误信息会以数组的形式返回，这里将其转换为字符串
      if (Array.isArray(msg)) {
        msg = msg.join(';');
      }
    }

    const data: THttpErrorResponse = {
      code: status,
      path: request.url,
      time: new Date(),
      msg,
      success: false,
    };

    // 对默认的 404 进行特殊处理
    // if (status === HttpStatus.NOT_FOUND) {
    //   data.msg = `接口 ${request.method} -> ${request.url} 无效`;
    // }
    void response.code(status).send(data);
  }
}
