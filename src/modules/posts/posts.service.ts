import { Injectable } from '@nestjs/common'
import { CreatePostDto, PagePostDto, UpdatePostDto } from './post.dto'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Post, Prisma } from '@prisma/client'
import { QueryMode } from '@/config/enum.config'
@Injectable()
export class PostsService {
  // 依赖注入PrismaService
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
    })
  }

  /**
   * @description: 查询全部
   * @param {QueryMode} mode 查询模式, 默认只包含未软删除的数据
   */
  findAll(mode: QueryMode = QueryMode.VALID) {
    return this.prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      where: { deleted: mode === QueryMode.ALL ? undefined : mode === QueryMode.DEL },
    })
  }

  /**
   * @description: 分页查询
   * @param {PagePostDto} dto 分页参数
   * @param {QueryMode} mode 查询模式, 默认只包含未软删除的数据
   */
  findPage(dto: PagePostDto, mode: QueryMode = QueryMode.VALID) {
    return this.prisma.x.post.paginate({
      // 按更新时间倒序
      orderBy: { updatedAt: 'desc' },
      pagination: { page: dto.page, pageSize: dto.pageSize },
      where: {
        deleted: mode === QueryMode.ALL ? undefined : mode === QueryMode.DEL,
        // 模糊搜索标题和内容
        OR: [
          { title: { contains: dto.searchStr ?? '' } },
          { content: { contains: dto.searchStr ?? '' } },
        ],
      },
    })
  }

  findOne(id: number) {
    // findUnique({where: { id }}); 获取单个文章
    // findUnique({where: { id }}).author(); 获取单个文章的作者信息
    // 详情文档： https://prisma.nodejs.cn/concepts/components/prisma-client/relation-queries#流畅的-api
    // tips: 不能在同一级别上使用include和select
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    })
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    })
  }

  /**
   * @description: 删除
   * @param {number} id 文章id
   * @param {boolean} softDelete 是否软删除
   */
  remove(id: number, softDelete: boolean = true) {
    if (softDelete) {
      return this.prisma.post.update({
        where: { id },
        data: { deleted: true },
      })
    } else {
      return this.prisma.post.delete({
        where: { id },
      })
    }
  }

  /**
   * @description: 批量删除
   */
  batchRemove(ids: number[], softDelete: boolean = true) {
    if (softDelete) {
      return this.prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { deleted: true },
      })
    } else {
      return this.prisma.post.deleteMany({
        where: { id: { in: ids } },
      })
    }
  }

  /**
   * @description: 批量恢复
   * @param {number[]} ids 文章id数组
   */
  restore(ids: number[]) {
    return this.prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { deleted: false },
    })
  }

  /**
   * 查询文章列表，支持排序、条件...查询
   */
  async posts(params: {
    skip?: number
    take?: number
    cursor?: Prisma.PostWhereUniqueInput
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }
}
