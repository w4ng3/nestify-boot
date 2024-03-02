import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Prisma, User as UserModel } from '@prisma/client'
import { CrudService } from '@/modules/core/crud/crud.service'

@Injectable()
export class UsersService extends CrudService {
  model: Prisma.ModelName = Prisma.ModelName.User
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }

  /**
   * 根据邮箱查找用户, 用于判断用户是该邮箱是否已经注册
   */
  findOneByEmail(email: string): Promise<UserModel> {
    return this.prisma.user.findUnique({ where: { email } })
  }
}
