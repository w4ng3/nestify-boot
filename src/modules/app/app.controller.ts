import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from '@/common/decorator/guest.decorator'
import { SkipInterceptor } from '@/common/decorator/skip.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @Get()
  @SkipInterceptor() // 跳过响应拦截器
  getHello(): string {
    return this.appService.getHello()
  }
}
