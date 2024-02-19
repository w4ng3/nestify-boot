import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  SerializeOptions,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { CrudService } from './crud.service'
import { PaginatedVo } from '@/common/model/paginate'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { FindManyParams, FindOneParams } from '@/common/model/params'
import { CrudInclude } from '@/common/decorator/param.decorator'
import { QueryMode } from '@/config/enum.config'

/**
 * @module core crud抽象 controller
 * @description : UseInterceptors 和 SerializeOptions 处理返回结果的序列化
 * 把相关前缀的字段排除在序列化之外，如 deleted，被继承后依然有效，且可以在handler中重写
 */
@SerializeOptions({ excludePrefixes: ['deleted'] })
@UseInterceptors(ClassSerializerInterceptor)
export class CrudController {
  constructor(private readonly service: CrudService) {}

  /**
   * @description: 新增
   */
  @ApiOperation({ summary: '新增' })
  @Post()
  create(@Body() data: any) {
    return this.service.create(data)
  }

  /**
   * @description: 查询单个
   */
  @ApiOperation({ summary: '根据ID查询' })
  @Get(':id')
  findOne(@Param() params: FindOneParams, @CrudInclude() inc: any) {
    console.log('include? :>> ', inc)
    return this.service.findOne(+params.id, inc)
  }

  /**
   * @description: 查询全部
   */
  // @SerializeOptions({ excludePrefixes: ['deleted', 'createdAt', 'updatedAt'] })
  @ApiOperation({ summary: '查询全部' })
  @Get('list')
  findAll(@CrudInclude() inc: any) {
    return this.service.findAll(inc)
  }

  /**
   * @description: 分页查询
   */
  // @ApiPaginatedResponse(Vo)
  @ApiOperation({ summary: '分页查询' })
  @Post('page')
  findPage(@Body() dto: any, @CrudInclude() inc: any): Promise<PaginatedVo<any>> {
    return this.service.findPage(dto, inc)
  }

  /**
   * @description: 更新
   */
  @ApiOkResponse({ description: '更新成功' })
  @ApiOperation({ summary: '更新' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<string> {
    await this.service.update(id, data)
    return '更新成功'
  }

  /**
   * @description: 批量删除
   */
  @ApiOkResponse()
  @ApiOperation({ summary: '删除' })
  @Delete()
  async delete(@Body() dto: FindManyParams): Promise<string> {
    try {
      await this.service.remove(dto.ids)
      return '删除成功'
    } catch (error) {
      throw new NotFoundException('删除失败,请重试')
    }
  }

  /**
   * @description: 分页查询已软删除的帖子
   * @param dto 分页查询参数
   * @param include 嵌套读取参数(关联查询)
   */
  @ApiOperation({ summary: '分页查询已软删除的帖子' })
  @Post('deleted/page')
  findPageOfDeleted(@Body() dto: any, @CrudInclude() inc: any) {
    return this.service.findPage(dto, inc, QueryMode.DEL)
  }

  /**
   * @description: 批量恢复
   * @param {number[]} dto.ids id数组
   */
  @ApiOkResponse()
  @ApiOperation({ summary: '恢复' })
  @Patch('restore')
  async restore(@Body() dto: FindManyParams): Promise<string> {
    await this.service.restore(dto.ids)
    return '恢复成功'
  }
}
