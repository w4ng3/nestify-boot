import { ApiProperty } from '@nestjs/swagger'
/**
 * @description 为 Swagger UI 定义通用分页模式
 */
export class PaginatedDto<TData> {
  @ApiProperty({ description: '当前页码', default: 1 })
  page?: number

  @ApiProperty({ description: '每页条数', default: 10 })
  pageSize: number

  @ApiProperty({ description: '总页数', example: 100 })
  pageCount: number

  @ApiProperty({ description: '总条数', example: 1000 })
  total: number

  list: TData[]
}
