import { UserJwtType } from '@/common/decorator/param.decorator'
import { PrismaService } from '@/common/prisma/prisma.service'
import { PERMISSION_KEY } from '@/config'
import { PermissionsEnum } from '@/config/enum.config'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/**
 * @description 用于验证用户是否具有特定权限的守卫
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<PermissionsEnum>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredPermission) return true
    // 从tokenz中获取用户信息
    const { user }: { user: UserJwtType } = context.switchToHttp().getRequest()
    // 从数据库中获取用户权限
    const { permission } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { permission: true },
    })
    // 如果有超级管理员权限，则直接放行 (& 比 === 更合适？)
    if (permission === PermissionsEnum.SUPER_ADMIN) return true
    // 进行位运算，判断用户是否具有该权限
    if (permission & requiredPermission) {
      return true
    } else {
      throw new ForbiddenException('您没有权限')
    }
  }
}
