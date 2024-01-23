import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, FindOneParams, UpdateUserDto } from './user.dto'
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @ApiOkResponse({ description: '获取单个用户信息', type: CreateUserDto })
  @Get(':id')
  findOne(@Param() params: FindOneParams) {
    return this.usersService.findOne(+params.id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id)
  }
}
