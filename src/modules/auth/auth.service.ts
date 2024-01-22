import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginUserDto } from '../users/user.dto'
import { AuthLoginVo } from './auth.vo'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto): Promise<AuthLoginVo> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (user?.password === dto.password) {
      // ...result 语法是对象展开运算符，用于从对象中提取出指定的属性
      const { id, email, name, role } = user
      // sub 是 JWT 标准中的一个属性，表示用户 ID,其他标准还有 iss(签发者),exp(过期时间),aud(接收方)等
      const payload = { sub: id, email: email }
      return {
        email,
        name,
        role,
        access_token: await this.jwtService.signAsync(payload),
      }
    }
    throw new UnauthorizedException({ message: '用户名或密码错误' })
  }
}
