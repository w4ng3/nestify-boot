/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PaginatedVo, paginatedDto } from '@/common/model/paginate'
import { PrismaService } from '@/common/prisma/prisma.service'
import { OrderType, QueryMode } from '@/config/enum.config'
import { Prisma } from '@prisma/client'

/**
 * @module core crud抽象 service
 * @T 泛型 CreateDto
 */
export abstract class CrudService {
  // Prisma schema model name
  abstract model: Prisma.ModelName
  // 依赖注入PrismaService
  constructor(protected prisma: PrismaService) {}

  /**
   * @description: 新增
   * @param data 新增参数
   */
  create(data: any): Promise<any> {
    return this.prisma[this.model].create({ data })
  }

  /**
   * @description: 查询单个
   * @param {number} id id
   */
  findOne(id: number): Promise<any> {
    // findUnique({where: { id }}); 获取单个文章
    // findUnique({where: { id }}).author(); 获取单个文章的作者信息
    // 详情文档： https://prisma.nodejs.cn/concepts/components/prisma-client/relation-queries#流畅的-api
    // tips: 不能在同一级别上使用include和select
    return this.prisma[this.model].findUnique({
      where: { id },
      // include: {
      //   author: {
      //     select: { name: true, email: true },
      //   },
      // },
    })
  }

  /**
   * @description: 查询全部
   * @param {QueryMode} mode 查询模式, 默认只包含未软删除的数据
   */
  findAll(mode: QueryMode = QueryMode.VALID): Promise<any[]> {
    return this.prisma[this.model].findMany({
      orderBy: { updatedAt: OrderType.DESC },
      where: { deleted: mode === QueryMode.ALL ? undefined : mode === QueryMode.DEL },
    })
  }

  /**
   * @description: 分页查询
   * @param {paginatedDto} dto 分页参数
   * @param {QueryMode} mode 查询模式, 默认只包含未软删除的数据
   */
  findPage(dto: paginatedDto, mode: QueryMode = QueryMode.VALID): Promise<PaginatedVo<any>> {
    return this.prisma.x[this.model].paginate({
      // 按更新时间倒序
      orderBy: { updatedAt: OrderType.DESC },
      pagination: { page: dto.page, pageSize: dto.pageSize },
      where: {
        deleted: mode === QueryMode.ALL ? undefined : mode === QueryMode.DEL,
        // 模糊搜索标题和内容
        // OR: [
        //   { title: { contains: dto.searchStr ?? '' } },
        //   { content: { contains: dto.searchStr ?? '' } },
        // ],
      },
    })
  }

  /**
   * @description 更新
   * @param {number} id id
   * @param updatePostDto 更新参数
   */
  update(id: number, updatePostDto: any) {
    return this.prisma[this.model].update({
      where: { id },
      data: updatePostDto,
    })
  }

  /**
   * @description: 批量删除
   * @param {number[]} ids id数组
   * @param {boolean} softDelete 是否软删除
   */
  remove(ids: number[], softDelete: boolean = true) {
    if (softDelete) {
      return this.prisma[this.model].updateMany({
        where: { id: { in: ids } },
        data: { deleted: true },
      })
    } else {
      return this.prisma[this.model].deleteMany({
        where: { id: { in: ids } },
      })
    }
  }

  /**
   * @description: 批量恢复
   * @param {number[]} ids id数组
   */
  restore(ids: number[]) {
    return this.prisma[this.model].updateMany({
      where: { id: { in: ids } },
      data: { deleted: false },
    })
  }
}
