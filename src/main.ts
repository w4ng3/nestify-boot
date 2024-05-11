import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { useContainer } from 'class-validator'
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe'
import { SuccessResponse } from './common/interceptor/success-response'
import { HttpFaild } from './common/interceptor/http-faild'
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { LoggerService } from '@nestjs/common/services/logger.service'
import { contentParser } from 'fastify-file-interceptor'
import { join } from 'path'
import helmet from '@fastify/helmet'
import { GLOBAL_PREFIX, STATIC_DIR, STATIC_PREFIX } from './config'
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      ignoreTrailingSlash: true,
    }),
  )

  app.setGlobalPrefix(GLOBAL_PREFIX) // 设置全局前缀

  app.enableCors({ origin: '*' }) // 允许跨域

  // 安全性中间件
  // @ts-ignore
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  // 文件上传中间件
  // @ts-ignore
  await app.register(contentParser)
  // 静态文件服务,可以直接访问 根目录上层的 nest-static 文件夹下的文件，
  // 例如：http://localhost:3000/assets/1.jpg
  app.useStaticAssets({ root: join(process.cwd(), STATIC_DIR), prefix: STATIC_PREFIX })

  // 使用 class-validator 验证器,
  // 在应用级别绑定 ValidationPipe 开始，从而确保所有端点都受到保护，不会接收到不正确的数据
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  // 使用 nest-winston 打印日志
  const nestWinston: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(nestWinston)
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
  // app
  //   .getHttpAdapter()
  //   .getInstance()
  //   .addHook('preHandler', async (request, reply) => {
  //     nestWinston.log(`Incoming request for:${request.method} - ${request.url}`)
  //     if (request.body) console.log('Request body:', request.body)
  //   })

  // 将 SuccessResponse 拦截器注册为全局拦截器
  app.useGlobalInterceptors(new SuccessResponse(nestWinston))
  // 将 TimeoutInterceptor 拦截器注册为全局拦截器，10s 超时
  app.useGlobalInterceptors(new TimeoutInterceptor(10000))
  // 捕捉全局错误
  app.useGlobalFilters(new HttpFaild(nestWinston))

  // swagger api 文档，仅在开发环境下开启
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('nest-fastify-api 接口文档')
      .setDescription(
        '-你好哇，crud boy，查看json数据请导航到 <a>http://localhost:3000/swagger-json</a>',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .setExternalDoc('查看更多', 'https://swagger.io')
      .addServer('http://localhost:3000/' + GLOBAL_PREFIX, '本地开发环境')
      .build()
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
      ignoreGlobalPrefix: true,
    }
    const document = SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup('swagger', app, document)
  }
  // 监听端口
  await app.listen(3000, '0.0.0.0')

  return nestWinston
}
void bootstrap().then((logger) => {
  logger.log(
    `successfully started server, url: http://localhost:3000/${GLOBAL_PREFIX}, env: ${process.env.NODE_ENV}`,
  )
})
