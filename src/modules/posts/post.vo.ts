import { ApiProperty } from '@nestjs/swagger'
import { CreatePostDto } from './post.dto'

export class PostVo extends CreatePostDto {
  @ApiProperty({ description: '文章id', example: 1 })
  id: number
  @ApiProperty({ description: '创建时间', example: '2024-01-20T06:26:38.000Z' })
  createdAt: Date
  @ApiProperty({ description: '更新时间', example: '2024-01-20T06:26:38.000Z' })
  updatedAt: Date
}
