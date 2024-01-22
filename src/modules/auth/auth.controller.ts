import { Body, Controller, Post, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { AuthLoginVo } from './auth.vo'
import { LoginUserDto } from '../users/user.dto'
import { Public } from './auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ type: AuthLoginVo })
  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    // 💡 通过 AuthGuard 守卫，返回token解析后的用户信息
    return req.user
  }
}

// 如果同时使用@Request 和 @Body 装饰器，那么 @Body 装饰器必须在 @Request 装饰器之前使用，否则会抛出异常。因为 @Request 装饰器会覆盖 @Body 装饰器的值。
