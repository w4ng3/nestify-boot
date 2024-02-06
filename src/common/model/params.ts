import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsNumberString } from 'class-validator'

/**
 * 查询单个参数，用于 class-validator 校验
 */
export class FindOneParams {
  @ApiProperty({ description: 'id', example: 1 })
  @IsNumberString({}, { message: 'id必须为数字类型' })
  id: number
}

/**
 * 批量操作，接收id数组
 */
export class FindManyParams {
  @ApiProperty({ description: 'id数组', type: [Number], example: [1, 2, 3] })
  @ArrayNotEmpty({ message: 'id数组不能为空' })
  ids: number[]
}

/**
 * @description: 基础VO，包含id、创建时间、更新时间
 */
export class BaseVo {
  @ApiProperty({ description: '主键id', example: 1 })
  id: number
  @ApiProperty({ description: '创建时间', example: '2024-01-20T06:26:38.000Z' })
  createdAt: Date
  @ApiProperty({ description: '更新时间', example: '2024-01-20T06:26:38.000Z' })
  updatedAt: Date
}
