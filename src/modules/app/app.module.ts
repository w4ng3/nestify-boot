import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from '@/modules/users/users.module'
import { PostsModule } from '@/modules/posts/posts.module'
import { PrismaModule } from '@/common/prisma/prisma.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { WinstonOptionsConfig } from '@/config/winston.config'
import { FileModule } from '@/modules/core/file/file.module'

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath, cache: true }),
    WinstonModule.forRoot(WinstonOptionsConfig),
    PrismaModule,
    UsersModule,
    PostsModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
