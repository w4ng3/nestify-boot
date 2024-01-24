import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import paginationExtension from '@/common/prisma/extends/prisma-pagination'

/**
 * 扩展客户端类型，更好的TS支持
 * 参考 https://prisma.nodejs.cn/concepts/components/prisma-client/client-extensions
 */
function getExtendedClient() {
  return new PrismaClient().$extends(paginationExtension)
}
type ExtendedPrismaClient = ReturnType<typeof getExtendedClient>

/**
 * @description 创建一个新的 PrismaService，它负责实例化 PrismaClient 并连接到你的数据库。
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /** 拓展客户端实例 */
  public readonly x: ExtendedPrismaClient

  constructor() {
    super()
    // 拓展 PrismaClient, 添加分页功能
    this.x = this.$extends(paginationExtension)
  }

  // tips: onModuleInit 是可选的 — 如果你将其遗漏，Prisma 将在第一次调用数据库时延迟连接。
  async onModuleInit() {
    console.log('初始化与数据库的连接:>> ', new Date())
    await this.$connect()
  }
  async onModuleDestroy() {
    console.log('关闭与数据库的连接', new Date())
    await this.$disconnect()
  }
}
