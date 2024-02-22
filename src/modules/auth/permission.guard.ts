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
    // 获取 @SetMetadata() 装饰器设置的元数据
    const defaultPermission = this.reflector.getAllAndOverride<PermissionsEnum>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // 获取 Reflect.defineMetadata 设置的元数据
    const crudPermission: PermissionsEnum = Reflect.getMetadata(
      PERMISSION_KEY,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      context.getClass().prototype,
      context.getHandler().name,
    )

    // 如果没有设置权限，则直接放行
    const requiredPermission = defaultPermission || crudPermission
    if (!requiredPermission) return true

    // 从tokenz中获取用户信息
    const { user }: { user: UserJwtType } = context.switchToHttp().getRequest()
    // 从数据库中获取用户权限
    const { permission } = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { permission: true },
    })
    // console.log('查看拥有的权限 :>> ', getPermissionList(permission))
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

/**
 * 添加权限 (位运算)
 * @param permission 拥有的权限
 * @param permissions 需要添加的权限
 */
export const addPermission = (permission: number, permissions: PermissionsEnum[]) => {
  return permissions.reduce((acc, cur) => acc | cur, permission)
}

/**
 * 删除权限 (位运算)
 * @param permission 拥有的权限
 * @param permissions 需要删除的权限
 */
export const removePermission = (permission: number, permissions: PermissionsEnum[]) => {
  return permissions.reduce((acc, cur) => acc & ~cur, permission)
}

/**
 * 校验权限 (位运算)
 * @param permission 拥有的权限
 * @param requiredPermission 需要校验的权限
 * @returns 是否具有该权限
 */
export const checkPermission = (
  permission: PermissionsEnum,
  requiredPermission: PermissionsEnum,
): boolean => {
  return (permission & requiredPermission) === requiredPermission
}

/**
 * 获取权限列表
 * @param permission 拥有的权限
 * @returns 权限列表
 */
export const getPermissionList = (permission: number): (PermissionsEnum | string)[] => {
  // 将枚举转换为对象
  const permissionsObject = Object.keys(PermissionsEnum).reduce(
    (acc, key) => {
      const value = PermissionsEnum[key]
      acc[key] = value
      return acc
    },
    {} as { [key: string]: number },
  )
  // 返回拥有的权限值列表，如 [1,2,4]
  return Object.values(permissionsObject).filter((p) => permission & p)
  // 返回拥有的权限列表，如 ['USER', 'ADMIN', 'VIP']
  // return Object.keys(permissionsObject).filter((p) => permission & permissionsObject[p])
}
