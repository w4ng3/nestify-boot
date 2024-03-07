import { SmsService } from '@/common/services/sms.service'
import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
const chalk = require('chalk')
// 邮件队列名称
export const SMS_QUEUE_NAME = 'SEND_SHORT_MESSAGE'
export const InjectSmsQueue = () => InjectQueue(SMS_QUEUE_NAME)

// 邮件作业名称
export type SmsJobName = 'verify' | 'notify'

/**
 * @description 短信处理器
 * concurrency 作业处理并发数
 */
@Processor(SMS_QUEUE_NAME, { concurrency: 3 })
export class SmsProcessor extends WorkerHost {
  private readonly logger = new Logger(SmsProcessor.name)

  constructor(private smsService: SmsService) {
    super()
  }

  async process(job: Job<string>): Promise<any> {
    const { name, data } = job
    // 根据作业名称执行不同的任务
    switch (name as SmsJobName) {
      case 'notify': // 发送通知短信
        // 待实现...
        await new Promise((resolve) => setTimeout(resolve, 3_000))
        break
      case 'verify': // 发送验证码短信
        await this.smsService.sendCode(data)
        break
      default:
        break
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(chalk.cyan.bgWhiteBright(`任务${job.id}开始: 发送短信给${job.data}`))
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
