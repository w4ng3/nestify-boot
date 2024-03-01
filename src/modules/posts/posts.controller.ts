import { Controller, Get, Query } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto, PageQueryPostDto, UpdatePostDto } from './post.dto'
import { Post as PostModel } from '@prisma/client'
import { ApiTags, ApiOkResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PostVo } from './post.vo'
import { CrudController } from '@/modules/core/crud/crud.controller'
import { Crud } from '@/modules/core/crud/crud.decorator'
// import { UseInterceptors } from '@nestjs/common'
// import { CacheInterceptor } from '@nestjs/cache-manager'

@Crud({
  enabled: [
    'create',
    'findOne',
    { name: 'findAll', option: { allowGuest: true } },
    'findPage',
    'update',
    'delete',
    'restore',
    'findPageOfDeleted',
  ],
  dtos: {
    create: CreatePostDto,
    update: UpdatePostDto,
    query: PageQueryPostDto,
  },
  queryInclude: { author: { select: { id: false, name: true, email: true } } },
})
@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
// @UseInterceptors(CacheInterceptor) // 使用缓存拦截器, 仅对get请求有效
export class PostsController extends CrudController {
  constructor(private readonly postsService: PostsService) {
    super(postsService)
  }

  /**
   * @description: 模糊查询文章列表
   * @param {string} searchStr 搜索字符串
   * 获取请求对象信息，查看nest文档：https://nest.nodejs.cn/controllers#请求对象
   * 查询过滤运算符的prisma文档：https://prisma.nodejs.cn/reference/api-reference/prisma-client-reference#过滤条件和运算符
   */
  @ApiOkResponse({ type: [PostVo] })
  @ApiOperation({ summary: '模糊查询' })
  @Get('filter')
  async getFilteredPosts(@Query('searchStr') searchStr: string): Promise<PostModel[]> {
    return this.postsService.posts({
      where: {
        OR: [
          {
            title: { contains: searchStr },
          },
          {
            content: { contains: searchStr },
          },
        ],
      },
    })
  }
}
