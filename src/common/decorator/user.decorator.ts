import { CreateUserDto } from '@/modules/users/user.dto'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PickType } from '@nestjs/swagger'

export class UserJwtType extends PickType(CreateUserDto, ['email'] as const) {
  /** 用户id */
  id: number
}
/**
 * @description 自定义参数装饰器，用于获取token解析后的用户信息，可接受参数，参数为用户信息中的某个字段
 * @example @User() user: UserJwtType
 * @example @User('id') id: number
 */
export const User = createParamDecorator((data: string, ctx: ExecutionContext): unknown => {
  const request = ctx.switchToHttp().getRequest()
  const user: UserJwtType = request.user
  return data ? user?.[data] : user
})
