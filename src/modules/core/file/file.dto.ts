import { ApiProperty } from '@nestjs/swagger'

/**
 * 单文件上传 DTO
 */
export class SingleFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string
}

/**
 * 多文件上传 DTO
 */
export class MultipleFilesDto {
  @ApiProperty({ type: Array, format: 'binary' })
  files: string[]
}
