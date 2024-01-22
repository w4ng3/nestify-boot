import { ApiProperty, PickType } from '@nestjs/swagger'
import { CreateUserDto } from '../users/user.dto'

export class AuthLoginVo extends PickType(CreateUserDto, ['email', 'name', 'role'] as const) {
  @ApiProperty({ description: 'JWT token', example: 'abcdefjhijklmn' })
  access_token: string
}
