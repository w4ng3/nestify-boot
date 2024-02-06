import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto, PagePostDto, UpdatePostDto } from './post.dto'
import { Post as PostModel } from '@prisma/client'
import { UseInterceptors } from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { ApiTags, ApiOkResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ApiPaginatedResponse } from '@/common/decorator/paginated.decorator'
import { PostVo } from './post.vo'
import { QueryMode } from '@/config/enum.config'
import { CrudController } from '../core/crud/crud.controller'
import { Crud } from '../core/crud/crud.decorator'

@Crud({
  id: 'post',
  enabled: [
    'create',
    'findAll',
    { name: 'findOne', option: { allowGuest: true } },
    'findPage',
    'update',
    'delete',
    'restore',
  ],
  dtos: {
    create: CreatePostDto,
    update: UpdatePostDto,
    query: UpdatePostDto,
  },
})
@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseInterceptors(CacheInterceptor) // 使用缓存拦截器, 仅对get请求有效
export class PostsController extends CrudController {
  constructor(private readonly postsService: PostsService) {
    super(postsService)
  }

  // @ApiOkResponse({ type: PostVo })
  // @ApiOperation({ summary: '创建帖子' })
  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto)
  // }

  // @ApiOkResponse({ type: [PostVo] })
  // @ApiOperation({ summary: '查询全部' })
  // @Guest()
  // @Get('list')
  // findAll() {
  //   return this.postsService.findAll(QueryMode.ALL)
  // }

  // @ApiPaginatedResponse(PostVo)
  // @ApiOperation({ summary: '分页查询' })
  // @Post('page')
  // findPage(@Body() dto: PagePostDto) {
  //   return this.postsService.findPage(dto, QueryMode.VALID)
  // }

  // @ApiOkResponse({ type: PostVo })
  // @ApiOperation({ summary: '根据id查询帖子' })
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.postsService.findOne(+id)
  // }

  @ApiPaginatedResponse(PostVo)
  @ApiOperation({ summary: '分页查询已删除的帖子' })
  @Post('deleted/page')
  findPageOfDeleted(@Body() dto: PagePostDto) {
    return this.postsService.findPage(dto, QueryMode.DEL)
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
