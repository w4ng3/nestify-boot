import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
/**
 * @description 创建一个新的 PrismaService，它负责实例化 PrismaClient 并连接到你的数据库。
 * tips: onModuleInit 是可选的 — 如果你将其遗漏，Prisma 将在第一次调用数据库时延迟连接。
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // console.log('开始连接数据库 :>> ', new Date());
    await this.$connect();
  }
  // tips: 如果你想要在应用程序关闭时自动断开连接，你可以使用 onApplicationShutdown 钩子。
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
