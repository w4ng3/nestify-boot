import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // 全局管道,在应用级别绑定 ValidationPipe 开始，从而确保所有端点都受到保护，不会接收到不正确的数据
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 将原始值转换为 DTO 类实例,还将执行基本类型的转换（例如将@Param的字符串转换为数字，布尔值等）
      whitelist: true, // 这将自动删除非白名单属性（那些在验证类DTO中没有任何装饰器的属性）
      // forbidNonWhitelisted: true, // 抛出错误，告诉我们哪些属性没有被允许
    }),
  );
  await app.listen(3000, '0.0.0.0');
}
void bootstrap();
