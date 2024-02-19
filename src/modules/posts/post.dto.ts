import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator'
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { paginatedDto } from '@/common/model/paginate'

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

/**
 * @description: 分页查询文章列表
 * @warning: 如果继承的属性中有字段被 IsNotEmpty装饰器修饰，那么要注意查询时不能传入空字符串
 */
export class PageQueryDto extends IntersectionType(paginatedDto, UpdatePostDto) {}
