import { Controller, Post, Body } from '@nestjs/common'
import { LoginService } from './login.service'
import { CreateLoginDto } from './dto/create-login.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto)
  }

  @Post('logout')
  logout() {
    return this.loginService.findAll()
  }
}
