/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/config/enum.config'

@Injectable()
export class SmsService {
  /**
   * 使用AK&SK初始化账号Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  private createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    })
    // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
    config.endpoint = `dysmsapi.aliyuncs.com`
    return new Dysmsapi20170525(config)
  }
  private client: Dysmsapi20170525

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.client = this.createClient(
      this.configService.get(ConfigEnum.ALI_ACCESS_KEY_ID),
      this.configService.get(ConfigEnum.ALI_ACCESS_KEY_SECRET),
    )
  }

  /**
   * @description 发送短信（验证码）
   * @param phone 手机号
   * @param code 验证码
   */
  async sendCode(phone: string): Promise<any> {
    // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例使用环境变量获取 AccessKey 的方式进行调用，仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html

    // 生成随机六位数
    const captcha = Math.floor(Math.random() * 1000000)
    // 存储验证码到redis，设置过期时间为5分钟
    await this.redis.set(`smsCaptcha:${phone}`, captcha, 'EX', 3000)

    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName: this.configService.get(ConfigEnum.SMS_SignName),
      templateCode: this.configService.get(ConfigEnum.SMS_TemplateCode),
      phoneNumbers: phone,
      templateParam: `{"code":"${captcha}"}`,
    })
    try {
      // 复制代码运行请自行打印 API 的返回值
      await this.client.sendSmsWithOptions(sendSmsRequest, new $Util.RuntimeOptions({}))
      return '短信发送成功'
    } catch (error) {
      // 错误 message
      // console.log(error.message)
      // 诊断地址
      // console.log(error.data['Recommend'])
      Util.assertAsString(error.message)
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
