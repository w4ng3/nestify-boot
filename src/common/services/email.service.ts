import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as EmailTemplate from 'email-templates'
import { join } from 'path'
import { MailInfoDto } from '../model/params'
import { EMAIL_CONFIG } from '@/config'
// 参考：[如何优雅的使用nestjs实现邮件发送](https://juejin.cn/post/7285233095057358884)

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter
  private emailTemplate: EmailTemplate
  private mailConfig = EMAIL_CONFIG
  constructor() {
    this.transporter = nodemailer.createTransport(this.mailConfig)
    this.emailTemplate = new EmailTemplate()
  }

  /**
   * @description 发送邮件（随机验证码）
   */
  async sendCodeEmail(mailInfo: MailInfoDto): Promise<string> {
    //生成随机六位数
    const captcha = Math.floor(Math.random() * 1000000)
    const template = join(process.cwd(), 'src/assets', 'email-template')
    const html = await this.emailTemplate.render(template, {
      name: 'js developer',
      captcha: captcha,
    })
    await this.transporter.sendMail({
      from: this.mailConfig.auth.user, //发送方邮箱
      to: mailInfo.to, //接收方邮箱
      subject: 'おはよう', // 标题
      html,
    })
    return '邮件发送成功'
  }
}
