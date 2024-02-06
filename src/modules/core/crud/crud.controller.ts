import { Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common'
import { CrudService } from './crud.service'
import { PaginatedVo, paginatedDto } from '@/common/model/paginate'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { FindManyParams } from '@/common/model/params'

/**
 * @module core crud抽象 controller
 */
export class CrudController {
  constructor(private readonly service: CrudService) {}

  /**
   * @description: 新增
   */
  // @ApiOkResponse({ type: V })
  // 泛型作为类型无法触发 class-validator 的校验，必须使用class类，所以这里的 T 无效
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
  findOne(@Param('id') id: number): Promise<any> {
    return this.service.findOne(id)
  }

  /**
   * @description: 查询全部
   */
  @ApiOperation({ summary: '查询全部' })
  @Get('list')
  findAll() {
    return this.service.findAll()
  }

  /**
   * @description: 分页查询
   */
  @ApiOperation({ summary: '分页查询' })
  @Post('page')
  findPage(@Body() dto: paginatedDto): Promise<PaginatedVo<any>> {
    return this.service.findPage(dto)
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
   * @description: 批量恢复
   */
  @ApiOkResponse()
  @ApiOperation({ summary: '恢复' })
  @Patch('restore')
  async restore(@Body() dto: FindManyParams): Promise<string> {
    await this.service.restore(dto.ids)
    return '恢复成功'
  }
}
