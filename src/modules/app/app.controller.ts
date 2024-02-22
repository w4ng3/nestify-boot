import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from '@/common/decorator/guest.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Guest()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
