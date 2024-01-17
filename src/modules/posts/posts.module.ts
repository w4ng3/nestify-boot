import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '@/common/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({ ttl: 5 * 1000, max: 10 })],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
