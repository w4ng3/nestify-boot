import { Controller, SerializeOptions } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto, PageQueryUserDto } from './user.dto'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { CrudController } from '@/modules/core/crud/crud.controller'
import { Crud } from '@/modules/core/crud/crud.decorator'

@Crud({
  enabled: ['findOne', 'findAll', 'findPage', 'update', 'delete'],
  dtos: {
    create: CreateUserDto,
    update: UpdateUserDto,
    query: PageQueryUserDto,
  },
  // queryInclude: { posts: true }, // 嵌套查询，获取用户的所有文章
})
@SerializeOptions({ excludePrefixes: ['deleted', 'password', 'createdAt', 'updatedAt'] })
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController extends CrudController {
  constructor(private readonly usersService: UsersService) {
    super(usersService)
  }
}
