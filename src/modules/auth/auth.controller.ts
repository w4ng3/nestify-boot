import { Body, Controller, Post, Get, Patch } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthLoginVo, ProfileVo } from './auth.vo'
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
} from '@/modules/users/user.dto'
import { ReqUser } from '@/common/decorator/param.decorator'
import { Guest } from '@/common/decorator/guest.decorator'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Guest()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiOkResponse({ type: AuthLoginVo })
  @Guest()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @ApiOkResponse({ type: ProfileVo, description: '根据token获取当前用户信息' })
  @Get('profile')
  getProfile(@ReqUser('id') id: number): Promise<ProfileVo> {
    return this.authService.profile(id)
  }

  /**
   * 修改密码
   */
  @ApiOkResponse()
  @Patch('change-password')
  updatePassword(@ReqUser('id') id: number, @Body() dto: ChangePasswordDto) {
    return this.authService.updatePassword(id, dto.oldPassword, dto.newPassword)
  }

  /**
   * 重置密码
   */
  @Guest()
  @Patch('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }
}
