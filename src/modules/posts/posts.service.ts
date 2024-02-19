import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Post, Prisma } from '@prisma/client'
import { CrudService } from '@/modules/core/crud/crud.service'

@Injectable()
export class PostsService extends CrudService {
  model: Prisma.ModelName = Prisma.ModelName.Post
  // 依赖注入PrismaService
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }

  /**
   * 查询文章列表，支持排序、条件...查询
   */
  async posts(params: {
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput
  }): Promise<Post[]> {
    const { where, orderBy } = params
    return this.prisma.post.findMany({
      where,
      orderBy,
    })
  }
}
