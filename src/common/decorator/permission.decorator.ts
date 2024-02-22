import { PERMISSION_KEY } from '@/config'
import { PermissionsEnum } from '@/config/enum.config'
import { SetMetadata } from '@nestjs/common'

/**
 * @description 提供一种将路由声明为需要特定权限的机制，将数据附加到路由处理程序的元数据中
 * 1.用它修饰路由，表示该路由需要 ADMIN 权限才能访问
 * @example 【 @RequirePermission(PermissionsEnum.ADMIN) 】
 *
 * 2.用它修饰类，表示该类下的所有路由都需要 ADMIN 权限才能访问
 * @example 【 @UseGuards(PermissionGuard)、@RequirePermission(PermissionsEnum.ADMIN) 】
 *
 * @Tips 如果在 auth.module.ts 中全局注册了 PermissionGuard 守卫，那么在路由中使用 @RequirePermission() 修饰符就可以不用再使用 @UseGuards() 修饰符了
 *
 */
export const RequirePermission = (p: PermissionsEnum) => SetMetadata(PERMISSION_KEY, p)
