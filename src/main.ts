/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { useContainer } from 'class-validator'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { SuccessResponse } from './common/response/success-response'
import { HttpFaild } from './common/response/http-faild'
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // logger: true 会在控制台打印出请求的信息
    // 更多日志配置参考： https://www.fastify.cn/docs/latest/Logging/
    new FastifyAdapter({
      logger: process.env.NODE_ENV === 'development' ? false : false,
      ignoreTrailingSlash: true,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  // 全局管道,在应用级别绑定 ValidationPipe 开始，从而确保所有端点都受到保护，不会接收到不正确的数据
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 将原始值转换为 DTO 类实例,还将执行基本类型的转换（例如将@Param的字符串转换为数字，布尔值等）
      whitelist: true, // 这将自动删除非白名单属性（那些在验证类DTO中没有任何装饰器的属性）
      // forbidNonWhitelisted: true, // 抛出错误，告诉我们哪些属性没有被允许
    }),
  )

  // app.enableShutdownHooks(); // 启用应用程序关闭钩子

  /**
   * 注册 Fastify 钩子,在每个请求时都会执行,实现类似express的中间件功能
   * onRequest 钩子: 这个钩子会在每个请求开始处理之前被调用，并打印出请求的 URL。
   * preHandler 钩子: 这个钩子在请求处理流程中较晚被触发，此时请求体已经被解析。
   * 更多钩子参考： https://www.fastify.cn/docs/latest/Hooks/
   */
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('preHandler', async (request, reply) => {
      console.log(`Incoming request for:${request.method} - ${request.url}`)
      if (request.body) console.log('Request body:', request.body)
    })

  // 将 SuccessResponse 拦截器注册为全局拦截器
  app.useGlobalInterceptors(new SuccessResponse())
  // 捕捉全局错误
  app.useGlobalFilters(new HttpFaild())

  // swagger api 文档，仅在开发环境下开启
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('nest-fastify-api 接口文档')
      .setDescription(
        '-你好哇，crud boy，查看json数据请导航到 <a>http://localhost:3000/api-json</a>',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .setExternalDoc('查看更多', 'https://swagger.io')
      .addServer('http://localhost:3000', '本地开发环境')
      .build()
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    }
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('api', app, document)
  }
  // 监听端口
  await app.listen(3000, '0.0.0.0')
}
void bootstrap()
