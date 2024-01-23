import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginUserDto } from '../users/user.dto'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import { UserJwtType } from '@/common/decorator/user.decorator'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto): Promise<AuthLoginVo> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (user?.password === dto.password) {
      const { id, email, name, role } = user
      const payload: UserJwtType = { id: id, email: email }
      return {
        email,
        name,
        role,
        access_token: await this.jwtService.signAsync(payload),
      }
    }
    throw new UnauthorizedException({ message: '用户名或密码错误' })
  }

  /**
   * @description 获取用户信息,不包含密码和id
   */
  async profile(id: number): Promise<ProfileVo> {
    const user = await this.userService.findOne(id)
    delete user.password
    delete user.id
    return user
  }
}
