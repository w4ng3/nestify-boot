import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from '@/common/decorator/guest.decorator'
import { SkipInterceptor } from '@/common/decorator/skip.decorator'
const chalk = require('chalk')

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @SkipInterceptor() // 跳过响应拦截器
  @Get()
  async getHello(): Promise<string> {
    // 测试超时拦截器
    await new Promise((resolve) => setTimeout(resolve, 1_000))
    // 体验粉笔效果，设置 console.log 的颜色
    console.log(chalk.yellow.bgMagenta('Hello Nest!'), chalk.blue.underline.bold('use chalk'))
    return this.appService.getHello()
  }
}
