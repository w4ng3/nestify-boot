import { ROLES_KEY } from '@/config'
import { RoleEnum } from '@/config/enum.config'
import { SetMetadata } from '@nestjs/common'
/**
 * @description 提供一种将路由声明为需要特定角色的机制，将数据附加到路由处理程序的元数据中
 *
 * 1.用它修饰路由，表示该路由需要 ADMIN 或 xx角色才能访问
 * @example [@Roles(RoleEnum.ADMIN, RoleEnum.USER)]
 *
 * 2.用它修饰类，表示该类下的所有路由都需要 ADMIN 角色才能访问
 * @example [@UseGuards(RolesGuard)、@Roles(RoleEnum.ADMIN)]
 *
 * @Tips 如果在 auth.module.ts 中全局注册了 RolesGuard 守卫，那么在路由中使用 @Roles() 修饰符就可以不用再使用 @UseGuards() 修饰符了
 *
 */
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles)
