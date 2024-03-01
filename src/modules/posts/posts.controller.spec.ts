import { Test, TestingModule } from '@nestjs/testing'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Post } from '@prisma/client'

describe('PostsController', () => {
  let controller: PostsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService, PrismaService],
    }).compile()

    controller = module.get<PostsController>(PostsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAll 方法应返回 deleted 都为 fasle 的数组', async () => {
    const list = await controller.findAll()
    list.forEach((obj: Post) => {
      expect(obj.deleted).toBe(false)
    })
  })
})
