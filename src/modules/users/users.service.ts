import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/common/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 查询用户列表，支持排序、条件...查询
   */
  async users(params: {
    skip?: number; // 指定跳过多少条数据
    take?: number; // 指定返回多少条数据
    cursor?: Prisma.UserWhereUniqueInput; // 指定从哪条数据开始查询
    where?: Prisma.UserWhereInput; // 指定查询条件
    orderBy?: Prisma.UserOrderByWithRelationInput; // 指定排序条件
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  create(createUserDto: CreateUserDto) {
    console.log('createUserDto :>> ', createUserDto);
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      // 嵌套查询，获取用户的所有文章
      // 文档：https://prisma.nodejs.cn/concepts/components/prisma-client/relation-queries#嵌套读取
      include: { posts: true },
      // 也可以指定查询字段来进行嵌套查询
      // select: {
      //   email: true,
      //   posts: {
      //     select: {
      //       title: true,
      //     },
      //   },
      // },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
