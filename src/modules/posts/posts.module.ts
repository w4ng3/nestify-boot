import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
// import { CacheModule } from '@nestjs/cache-manager'

@Module({
  // imports: [CacheModule.register({ ttl: 5 * 1000, max: 10 })], // 注入缓存模块
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
