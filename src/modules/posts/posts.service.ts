import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
@Injectable()
export class PostsService {
  // 依赖注入PrismaService
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    console.log('createPostDto :>> ', createPostDto);
    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  page() {
    return this.prisma.x.post.paginate({
      orderBy: {
        updatedAt: 'desc', // 按更新时间倒序
      },
      pagination: {
        page: 1,
        pageSize: 5,
      },
    });
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
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  /**
   * 查询文章列表，支持排序、条件...查询
   */
  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
