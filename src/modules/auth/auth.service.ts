import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { CreateUserDto, LoginUserDto } from '@/modules/users/user.dto'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import { UserJwtType } from '@/common/decorator/user.decorator'
import { decrypt, encrypt } from '@/utils/helpers'
import { PrismaService } from '@/common/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /** @description 注册 */
  async register(dto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (user) {
      throw new UnauthorizedException({ message: '用户已存在' })
    } else {
      dto.password = encrypt(dto.password, 10)
      const user = await this.prisma.user.create({ data: dto })
      const { id, email, name, role } = user
      return {
        email,
        name,
        role,
        access_token: await this.jwtService.signAsync({ id: id, email: email }),
      }
    }
  }

  /** @description 登录 */
  async login(dto: LoginUserDto): Promise<AuthLoginVo> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException({ message: '用户名或密码错误' })
    } else {
      if (!decrypt(dto.password, user.password)) {
        throw new UnauthorizedException({ message: '用户名或密码错误' })
      }
      const { id, email, name, role } = user
      const payload: UserJwtType = { id: id, email: email }
      return {
        email,
        name,
        role,
        access_token: await this.jwtService.signAsync(payload),
      }
    }
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
