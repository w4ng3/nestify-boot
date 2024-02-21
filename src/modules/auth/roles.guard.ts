import { UserJwtType } from '@/common/decorator/param.decorator'
import { ROLES_KEY } from '@/config'
import { RoleEnum } from '@/config/enum.config'
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/**
 * @description 用于验证用户是否具有特定角色的守卫
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true
    const { user }: { user: UserJwtType } = context.switchToHttp().getRequest()
    // 如果用户是超级管理员，则直接放行
    if (user.role === RoleEnum.SUPER_ADMIN) return true
    // 如果用户角色不在 requiredRoles 中，则抛出异常
    const permit = requiredRoles.some((role) => user.role === role)
    if (!permit) {
      throw new ForbiddenException('当前角色没有权限访问')
    }
    return permit
  }
}
