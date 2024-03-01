import { Test, TestingModule } from '@nestjs/testing'
import { PostsService } from './posts.service'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Post } from '@prisma/client'

describe('PostsService', () => {
  let service: PostsService
  // 在每次测试之前执行的钩子函数，称为设置阶段，出此之外，还有 beforeAll(),afterEach(),afterAll()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PrismaService],
    }).compile()

    service = module.get<PostsService>(PostsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('findAll 方法应返回 deleted 都为 fasle 的数组', async () => {
    const list = await service.findAll()
    list.forEach((obj: Post) => {
      expect(obj.deleted).toBe(false)
    })
  })
})
