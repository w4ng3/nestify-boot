import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto, PagePostDto, UpdatePostDto } from './post.dto'
import { Post as PostModel } from '@prisma/client'
import { UseInterceptors } from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { ApiTags, ApiOkResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ApiPaginatedResponse } from '@/common/decorator/paginated.decorator'
import { PostVo } from './post.vo'
import { Public } from '@/common/decorator/public.decorator'
import { FindManyParams } from '@/common/model/params'
import { QueryMode } from '@/config/enum.config'

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseInterceptors(CacheInterceptor) // 使用缓存拦截器, 仅对get请求有效
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOkResponse({ type: PostVo })
  @ApiOperation({ summary: '创建帖子' })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  @ApiOkResponse({ type: [PostVo] })
  @ApiOperation({ summary: '查询全部' })
  @Public()
  @Get('list')
  findAll() {
    return this.postsService.findAll(QueryMode.ALL)
  }

  @ApiPaginatedResponse(PostVo)
  @ApiOperation({ summary: '分页查询' })
  @Post('page')
  findPage(@Body() dto: PagePostDto) {
    return this.postsService.findPage(dto, QueryMode.VALID)
  }

  @ApiPaginatedResponse(PostVo)
  @ApiOperation({ summary: '分页查询已删除的帖子' })
  @Post('deleted/page')
  findPageOfDeleted(@Body() dto: PagePostDto) {
    return this.postsService.findPage(dto, QueryMode.DEL)
  }

  @ApiOkResponse({ type: PostVo })
  @ApiOperation({ summary: '根据id查询帖子' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id)
  }

  @ApiOkResponse({ description: '更新成功' })
  @ApiOperation({ summary: '更新帖子' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @ApiOkResponse()
  @ApiOperation({ summary: '批量恢复被删除的帖子' })
  @Patch('restore')
  restore(@Body() dto: FindManyParams) {
    return this.postsService.restore(dto.ids)
  }

  @ApiOkResponse()
  @ApiOperation({ summary: '删除帖子' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.postsService.remove(+id)
      return `帖子-${id} 删除成功`
    } catch (error) {
      throw new NotFoundException('删除失败,该帖子不存在')
    }
  }

  @ApiOkResponse()
  @ApiOperation({ summary: '批量删除帖子' })
  @Delete('batch')
  async batchRemove(@Body() dto: FindManyParams) {
    try {
      await this.postsService.batchRemove(dto.ids)
      return '帖子删除成功'
    } catch (error) {
      throw new NotFoundException('删除失败,请重试')
    }
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
