import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileService } from './file.service'
import { Guest } from '@/common/decorator/guest.decorator'
import { createReadStream } from 'fs'
import { join } from 'path'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as dayjs from 'dayjs'
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  AnyFilesFastifyInterceptor,
  FileFastifyInterceptor,
  FilesFastifyInterceptor,
  diskStorage,
} from 'fastify-file-interceptor'
import { editFileName, imageFileFilter } from './file-upload-util'
import { MultipleFilesDto, SingleFileDto } from './file.dto'
import { fileMapper, filesMapper } from './file.mapper'

@ApiTags('file')
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 设置响应头，可以直接使用装饰器 @Header('Content-Type', 'application/octet-stream')，
  // 也可以使用 fastify 自身的方法，这样的好处可以读取dto变量动态设置文件名，文档在 https://fastify.dev/docs/latest/Reference/Reply/#headerkey-value

  // application/octet-stream：二进制流，不知道下载文件类型时使用
  // application/json：json格式文件，用于返回json数据
  // application/pdf：pdf文件
  // application/msword：word文件
  // application/vnd.ms-excel：excel文件
  // application/zip：zip文件
  // application/x-gzip：gzip文件
  // application/x-compressed：压缩文件
  // application/x-mp3：mp3文件
  @Guest()
  @Get('download/readme')
  getReadme(@Res() reply: FastifyReply) {
    const dateStr = dayjs().format('YYYY-MM-DD')
    const file = createReadStream(join(process.cwd(), `README.md`))
    return reply
      .header('Content-Type', 'application/octet-stream')
      .header('Content-Disposition', `attachment; filename="README-${dateStr}.md"`)
      .send(file)
  }

  @ApiOperation({ summary: '单图上传' })
  @ApiConsumes('multipart/form-data')
  @Post('upload/photo')
  @UseInterceptors(
    FileFastifyInterceptor('file', {
      storage: diskStorage({
        destination: './upload/imgs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadSingle(
    @Req() req: FastifyRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SingleFileDto,
  ) {
    // console.log({ ...body, file: file })
    // return { ...body, file: fileMapper({ file, req }) }
    return fileMapper({ file, req })
  }

  @ApiOperation({ summary: '多图上传', description: '最多上传9个文件' })
  @ApiConsumes('multipart/form-data')
  @Post('upload/multiple-photo')
  @UseInterceptors(
    FilesFastifyInterceptor('files', 9, {
      storage: diskStorage({
        destination: './upload/imgs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadMultiple(
    @Req() req: FastifyRequest,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: MultipleFilesDto,
  ) {
    // return { ...body, files: filesMapper({ files, req }) }
    return filesMapper({ files, req })
  }

  @ApiOperation({ summary: '文件上传', description: '可上传任何格式文件' })
  @ApiConsumes('multipart/form-data')
  @Post('upload/any-file')
  @UseInterceptors(
    AnyFilesFastifyInterceptor({
      storage: diskStorage({
        destination: './upload/files',
        filename: editFileName,
      }),
      // fileFilter: imageFileFilter,
    }),
  )
  anyFile(@UploadedFiles() files: Express.Multer.File, @Body() body: SingleFileDto) {
    // console.log({ ...body, photo_url: files })
    return { ...body, files }
  }
}
