import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsNumber } from 'class-validator'

/**
 * @description: 分页查询通用参数
 */
export class paginatedDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '页码', default: 1, required: false })
  page: number
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '每页数量', default: 12, required: false })
  pageSize: number
}

/**
 * @description 为 Swagger UI 定义通用分页模式
 */
export class PaginatedVo<TData> extends paginatedDto {
  @ApiProperty({ description: '总页数', example: 100, required: false })
  pageCount: number

  @ApiProperty({ description: '总条数', example: 1000, required: false })
  total: number

  list: TData[]
}
