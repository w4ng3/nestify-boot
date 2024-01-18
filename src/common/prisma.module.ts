import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
/**
 * @description 创建一个新的 PrismaService，它负责实例化 PrismaClient 并连接到你的数据库。
 * Global 装饰器将 PrismaService 导出为全局模块，这样你就可以在整个应用程序中使用它。
 */

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
