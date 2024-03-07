import { EmailService } from '@/common/services/email.service'
import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import Mail from 'nodemailer/lib/mailer'
const chalk = require('chalk')
// 邮件队列名称
export const EMAIL_QUEUE_NAME = 'SEND_EMAIL'
export const InjectEmailQueue = () => InjectQueue(EMAIL_QUEUE_NAME)

// 邮件作业名称
export type EmailJobName = 'verify' | 'welcome' | 'advertisement'

/**
 * @description 邮件处理器
 * concurrency 作业处理并发数
 */
@Processor(EMAIL_QUEUE_NAME, { concurrency: 3 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name)

  constructor(private emailService: EmailService) {
    super()
  }

  async process(job: Job<Mail.Options>): Promise<any> {
    const { name, data } = job
    // 根据作业名称执行不同的任务
    switch (name as EmailJobName) {
      case 'welcome': // 发送欢迎邮件
        // 待实现...
        await new Promise((resolve) => setTimeout(resolve, 5_000))
        break
      case 'verify': // 发送验证码邮件
        await this.emailService.sendCodeEmail({ to: data.to as string })
        break
      default:
        break
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(chalk.cyan.bgWhiteBright(`任务${job.id}开始:发送邮件给${job.data.to}`))
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(chalk.cyan.bgWhiteBright(`任务${job.id}已完成`))
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.log(chalk.bgRed(`任务${job.id}失败`))
  }
}
