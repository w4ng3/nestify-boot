import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '@/modules/users/users.service'
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from '@/modules/users/user.dto'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import { UserJwtType } from '@/common/decorator/param.decorator'
import { decrypt, encrypt } from '@/utils/helpers'
import { PrismaService } from '@/common/prisma/prisma.service'
import { User as UserModel } from '@prisma/client'
import { addPermission, removePermission } from './permission.guard'
import { PermissionsEnum } from '@/config/enum.config'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Queue } from 'bullmq'
import { InjectEmailQueue, EmailJobName } from '@/modules/core/queues/email.processor'
import Mail from 'nodemailer/lib/mailer'
import { InjectSmsQueue, SmsJobName } from '@/modules/core/queues/sms.processor'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
    @InjectEmailQueue() readonly emailQueue: Queue,
    @InjectSmsQueue() readonly smsQueue: Queue,
  ) {}

  // async getFromRedis(key: string) {
  //   return await this.redis.get(key)
  // }

  /**
   * @description 添加邮件队列
   * @param jobName 作业名称
   * @param data 作业数据
   */
  async addToEmailQueue(jobName: EmailJobName, data: Mail.Options) {
    const job = await this.emailQueue.add(jobName, data)
    return { jobId: job.id, describe: '邮件即将发送，请注意查收', to: data.to }
  }

  /**
   * @description 添加短信队列
   * @param jobName 作业名称
   * @param phone 手机号
   */
  async addToSmsQueue(jobName: SmsJobName, phone: string) {
    const job = await this.smsQueue.add(jobName, phone)
    return { jobId: job.id, describe: '短信即将发送，请注意查收', to: phone }
  }

  /** @description 注册 */
  async register(dto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (user) {
      throw new UnauthorizedException({ message: '用户已存在' })
    } else {
      dto.password = encrypt(dto.password, 10)
      const user = await this.prisma.user.create({ data: dto })
      const { id, email, name } = user
      const payload: UserJwtType = { id, email }
      return {
        email,
        name,
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
      const { id, email, name } = user
      const payload: UserJwtType = { id, email }
      return {
        email,
        name,
        access_token: await this.jwtService.signAsync(payload),
      }
    }
  }

  /**
   * @description 获取用户信息,不包含密码和id
   */
  async profile(id: number): Promise<ProfileVo> {
    const user: UserModel = await this.userService.findOne(id)
    const { email, name, permission } = user
    return { email, name, permission }
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

  /**
   * 修改权限
   * @param id 用户id
   * @param permissions 权限列表
   * @param type 操作类型 add | remove
   */
  async updatePermission(id: number, permissions: PermissionsEnum[], type: 'add' | 'remove') {
    if (permissions.includes(PermissionsEnum.SUPER_ADMIN)) {
      throw new HttpException('禁止添加超管权限', HttpStatus.FORBIDDEN)
    }
    const user: UserModel = await this.userService.findOne(id)
    if (user.permission === PermissionsEnum.SUPER_ADMIN) {
      throw new HttpException('超级管理员权限不可编辑', HttpStatus.FORBIDDEN)
    }
    if (type === 'add') {
      const permission = addPermission(user.permission, permissions)
      return this.prisma.user.update({ where: { id }, data: { permission } })
    } else if (type === 'remove') {
      const permission = removePermission(user.permission, permissions)
      return this.prisma.user.update({ where: { id }, data: { permission } })
    } else {
      throw new HttpException('操作类型错误', HttpStatus.BAD_REQUEST)
    }
  }
}
