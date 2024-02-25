import { SKIP_INTERCEPTOR } from '@/config'
import { SetMetadata } from '@nestjs/common'

export const SkipInterceptor = () => SetMetadata(SKIP_INTERCEPTOR, true)
