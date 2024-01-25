import { Body, Controller, Post, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import { CreateUserDto, LoginUserDto } from '../users/user.dto'
import { ReqUser } from '@/common/decorator/user.decorator'
import { Public } from '@/common/decorator/public.decorator'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiOkResponse({ type: AuthLoginVo })
  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @ApiOkResponse({ type: ProfileVo, description: '根据token获取当前用户信息' })
  @Get('profile')
  getProfile(@ReqUser('id') id: number): Promise<ProfileVo> {
    return this.authService.profile(id)
  }
}
