import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from '@/modules/users/user.dto'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import { UserJwtType } from '@/common/decorator/param.decorator'
import { decrypt, encrypt } from '@/utils/helpers'
import { PrismaService } from '@/common/prisma/prisma.service'
import { User as UserModel } from '@prisma/client'

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
      const payload: UserJwtType = { id, email, role }
      return {
        email,
        name,
        role,
        access_token: await this.jwtService.signAsync(payload),
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
      const payload: UserJwtType = { id, email, role }
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
    const user: UserModel = await this.userService.findOne(id)
    const { email, name, role } = user
    return { email, name, role }
  }

  /**
   * 修改密码
   * 内置-http-异常：https://nest.nodejs.cn/exception-filters#内置-http-异常
   * 状态码规范: https://www.runoob.com/http/http-status-codes.html
   */
  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user: UserModel = await this.userService.findOne(id)
    if (!decrypt(oldPassword, user.password)) {
      throw new HttpException('原密码错误', HttpStatus.FORBIDDEN)
    }
    const password = encrypt(newPassword, 10)
    await this.prisma.user.update({ where: { id }, data: { password } })
    return '修改成功'
  }

  /**
   * 重置密码
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userService.findOneByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException({ message: '该邮箱未注册' })
    } else if (dto.code !== '123456') {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: encrypt(dto.password, 10) },
    })
    return '重置成功'
  }
}
