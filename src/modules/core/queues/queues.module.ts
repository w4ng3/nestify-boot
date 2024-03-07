import { BullModule } from '@nestjs/bullmq'
import { DynamicModule, Module } from '@nestjs/common'
import { EMAIL_QUEUE_NAME, EmailProcessor } from './email.processor'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/config/enum.config'
import { EmailService } from '@/common/services/email.service'
import { SMS_QUEUE_NAME, SmsProcessor } from './sms.processor'
import { SmsService } from '@/common/services/sms.service'

@Module({})
export class QueuesModule {
  static register(): DynamicModule {
    const emailQueue = BullModule.registerQueue({ name: EMAIL_QUEUE_NAME })
    const smsQueue = BullModule.registerQueue({ name: SMS_QUEUE_NAME })

    if (!emailQueue.providers || !emailQueue.exports) {
      throw new Error('Unable to build queue')
    }

    return {
      global: true,
      module: QueuesModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            return {
              connection: {
                host: config.get<string>(ConfigEnum.REDIS_HOST),
                port: config.get<number>(ConfigEnum.REDIS_PORT),
                password: config.get<string>(ConfigEnum.REDIS_PASSWORD),
              },
              defaultJobOptions: {
                removeOnComplete: 1000, // 指定要保留的最大成功作业数量，或者设置为 true 以删除所有成功作业
                removeOnFail: 3000, // 指定要保留的最大失败作业数量
                attempts: 3, // 作业失败时的最大重试次数
                backoff: {
                  // 重试延迟策略
                  type: 'exponential',
                  delay: 1_000,
                },
              },
            }
          },
        }),
        emailQueue,
        smsQueue,
      ],
      providers: [
        EmailProcessor,
        ...emailQueue.providers,
        EmailService,
        SmsProcessor,
        ...smsQueue.providers,
        SmsService,
      ],
      exports: [...emailQueue.exports, ...smsQueue.exports],
    }
  }
}
