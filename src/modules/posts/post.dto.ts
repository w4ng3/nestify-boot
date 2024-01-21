import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @ApiProperty({ description: '标题', example: '我在荒岛上迎接黎明' })
  title: string
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '内容', example: '...我想避开别人来试试我自己', required: false })
  content?: string
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '作者id', example: 1, required: false })
  authorId?: number
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '是否发布', example: true, required: false })
  published?: boolean
}

/**
 * @description: 继承自 CreatePostDto，使用 PartialType 装饰器，将所有字段设置为可选
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
