import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as EmailTemplate from 'email-templates'
import { join } from 'path'
import { MailInfoDto } from '../model/params'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/config/enum.config'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private emailTemplate: EmailTemplate

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get(ConfigEnum.EMAIL_HOST),
      port: this.configService.get(ConfigEnum.EMAIL_PORT),
      secure: true,
      auth: {
        user: this.configService.get(ConfigEnum.EMAIL_USER),
        pass: this.configService.get(ConfigEnum.EMAIL_PASS),
      },
    })
    this.emailTemplate = new EmailTemplate()
  }

  /**
   * @description 发送邮件（随机验证码）
   */
  async sendCodeEmail(mailInfo: MailInfoDto): Promise<string> {
    //生成随机六位数
    const captcha = Math.floor(Math.random() * 1000000)
    // 存储验证码到redis，设置过期时间为5分钟
    await this.redis.set(`emailCaptcha:${mailInfo.to}`, captcha, 'EX', 3000)

    const template = join(process.cwd(), 'src/assets', 'email-template')
    const html = await this.emailTemplate.render(template, {
      name: 'js developer',
      captcha: captcha,
    })
    await this.transporter.sendMail({
      from: this.configService.get(ConfigEnum.EMAIL_USER), //发送方邮箱
      to: mailInfo.to, //接收方邮箱
      subject: 'おはよう', // 标题
      html,
    })
    return '邮件发送成功'
  }
}
