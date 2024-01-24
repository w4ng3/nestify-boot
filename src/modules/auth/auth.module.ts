import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/config/enum.config'
import { AuthGuard } from './auth.guard'
/**
 * 全局注册 JWT 模块
 * 有关可用配置选项的更多详细信息，请参阅文档了解
 * https://github.com/nestjs/jwt/blob/master/README.md
 *
 * @APP_GUARD Nest 将自动将 AuthGuard 绑定到所有端点。
 */

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>(ConfigEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get<string>(ConfigEnum.JWT_EXPIRATION_TIME),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
