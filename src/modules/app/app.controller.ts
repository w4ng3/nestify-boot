import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Guest } from '@/common/decorator/guest.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Guest()
  getHello(): string {
    return this.appService.getHello()
  }
}
