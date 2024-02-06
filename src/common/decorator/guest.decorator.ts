import { ALLOW_GUEST } from '@/config'
import { SetMetadata } from '@nestjs/common'

/**
 * @description 提供一种将路由声明为公共的机制
 * 使用 SetMetadata 装饰器工厂函数创建自定义装饰器。
 * 得到 @Guest()装饰器，我们可以用它来装饰任何方法，以便在路由处理程序中访问它。
 * 在 AuthGuard守卫中，我们使用 Reflector 服务来获取路由处理程序上的元数据。
 */
export const Guest = () => SetMetadata(ALLOW_GUEST, true)
