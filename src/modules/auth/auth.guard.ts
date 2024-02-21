import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'
import { ALLOW_GUEST } from '@/config'
import { ConfigEnum } from '@/config/enum.config'

/**
 * @description 用于验证用户是否登录的守卫
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  // 💡 从请求头中提取 token
  // 💡 请求头的格式为 Bearer token，例："Authorization: Bearer token..."
  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取 @SetMetadata() 装饰器设置的元数据
    const defaultGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
      context.getHandler(), // 💡 context.getHandler() 返回当前路由处理程序的引用
      context.getClass(), // 💡 context.getClass() 返回当前路由处理程序的类引用
    ])

    // 获取 Reflect.defineMetadata 设置的元数据
    const crudGuest = Reflect.getMetadata(
      ALLOW_GUEST,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      context.getClass().prototype,
      context.getHandler().name,
    )
    // 💡 如果当前请求允许游客访问，则直接返回 true
    const allowGuest = defaultGuest || crudGuest
    if (allowGuest) return true

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      // 💡 如果没有 token,则抛出一个未授权的异常，默认返回code为401
      throw new UnauthorizedException('未授权')
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(ConfigEnum.JWT_SECRET),
      })
      // 💡 我们将负载分配给请求对象，以便我们可以在路由处理程序中访问它
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('token 无效')
    }
    return true
  }
}
