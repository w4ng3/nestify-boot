import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
/**
 * @description 创建一个新的 PrismaService，它负责实例化 PrismaClient 并连接到你的数据库。
 * tips: onModuleInit 是可选的 — 如果你将其遗漏，Prisma 将在第一次调用数据库时延迟连接。
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
