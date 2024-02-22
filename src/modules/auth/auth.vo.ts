import { ApiProperty, PickType } from '@nestjs/swagger'
import { CreateUserDto } from '../users/user.dto'

export class AuthLoginVo extends PickType(CreateUserDto, ['email', 'name'] as const) {
  @ApiProperty({ description: 'JWT token', example: 'abcdefjhijklmn' })
  access_token: string
}

export class ProfileVo extends PickType(CreateUserDto, ['email', 'name'] as const) {
  @ApiProperty({ description: '权限', required: false, default: 0 })
  permission: number
}
