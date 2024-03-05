import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from '@/common/decorator/guest.decorator'
import { SkipInterceptor } from '@/common/decorator/skip.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @SkipInterceptor() // 跳过响应拦截器
  @Get()
  async getHello(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 测试超时拦截器
    return this.appService.getHello()
  }
}
