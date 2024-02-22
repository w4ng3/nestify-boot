import { IsEmail, IsNotEmpty, IsString, Length, IsStrongPassword, IsEnum } from 'class-validator'
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger'
import { paginatedDto } from '@/common/model/paginate'
import { PermissionsEnum } from '@/config/enum.config'

export class CreateUserDto {
  @ApiProperty({ description: '邮箱', example: 'riddler@gmail.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
  @ApiProperty({ description: '姓名', example: '王亖' })
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string
  @ApiProperty({ description: '密码', example: 'Mm1234' })
  @IsStrongPassword(
    { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    { message: '密码必须包含大小写字母和数字,长度大于6位' },
  )
  password: string
}

// PartialType() 函数接受一个类作为参数，并创建一个新类，该类具有与原始类相同的属性，但是它们都是可选的。
// 更多映射类型，查看文档 https://nest.nodejs.cn/openapi/mapped-types#
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {}

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}

/**
 * @description: 用户分页查询 DTO
 */
export class PageQueryUserDto extends IntersectionType(paginatedDto, UpdateUserDto) {
  @ApiProperty({ description: '邮箱', example: 'joker@gmail.com' })
  @IsString()
  email: string
}

/**
 * @description: 修改密码 DTO
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '原密码', example: 'Mm123123' })
  @IsString()
  @IsNotEmpty({ message: '原密码不能为空' })
  oldPassword: string
  @ApiProperty({ description: '新密码', example: 'Mm1234' })
  @IsStrongPassword(
    { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    { message: '密码必须包含大小写字母和数字,长度大于6位' },
  )
  newPassword: string
}

/**
 * @description: 重置密码 DTO
 */
export class ResetPasswordDto {
  @ApiProperty({ description: '邮箱', example: 'riddler@gmail.com' }) // 重置密码时,邮箱是必填的
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsString()
  @Length(6, 6, { message: '验证码长度为6位' })
  code: string

  @ApiProperty({ description: '新密码', example: 'Mm1234' })
  @IsStrongPassword(
    { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    { message: '密码必须包含大小写字母和数字,长度大于6位' },
  )
  password: string
}

/**
 * @description: 修改权限 DTO
 */
export class updatePermissionDto {
  @ApiProperty({ description: '用户id', example: 1 })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: number

  @ApiProperty({
    description: '权限',
    example: [4, 8],
    type: [Number],
    enum: PermissionsEnum,
  })
  @IsEnum(PermissionsEnum, { each: true, message: '权限值不合法' })
  permissions: PermissionsEnum[]

  @ApiProperty({ description: '操作类型', example: 'add', enum: ['add', 'remove'] })
  @IsEnum(['add', 'remove'], { message: '操作类型必须是add或remove' })
  type: 'add' | 'remove'
}
