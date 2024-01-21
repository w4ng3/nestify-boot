import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'
import { Post as PostModel } from '@prisma/client'
import { UseInterceptors } from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { PaginatedDto } from '@/common/response/dto/paginate.dto'
import { ApiPaginatedResponse } from '@/common/response/ApiPaginatedResponse'
import { PostVo } from './post.vo'

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(CacheInterceptor) // 使用缓存拦截器, 仅对get请求有效
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOkResponse({ type: PostVo })
  @ApiOperation({ summary: '创建文章' })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  @ApiOkResponse({ type: [PostVo] })
  @Get('list')
  findAll() {
    // 调试可以看到，第一次查询数据库，5秒内第二次查询会从缓存中获取
    // 更多缓存内容查看文档：https://nest.nodejs.cn/techniques/caching
    // console.log('查询数据库中～ :>> ', new Date());
    return this.postsService.findAll()
  }

  @ApiPaginatedResponse(PostVo)
  @Get('page')
  page(): Promise<PaginatedDto<PostVo>> {
    return this.postsService.page()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id)
  }

  /**
   * @description: 模糊查询文章列表
   * @param {string} searchStr 搜索字符串
   * 获取请求对象信息，查看nest文档：https://nest.nodejs.cn/controllers#请求对象
   * 查询过滤运算符的prisma文档：https://prisma.nodejs.cn/reference/api-reference/prisma-client-reference#过滤条件和运算符
   */
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
