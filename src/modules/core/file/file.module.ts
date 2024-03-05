import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { OssService } from '@/common/services/oss.service'

@Module({
  controllers: [FileController],
  providers: [FileService, OssService],
  exports: [FileService],
})
export class FileModule {}
