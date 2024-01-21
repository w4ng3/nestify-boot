import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: '邮箱', example: 'joker@gmail.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
  @ApiProperty({ description: '姓名', example: '王亖' })
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string
  @ApiProperty({ description: '密码', example: '123456' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
  @ApiProperty({ description: '角色', required: false, default: 'USER' })
  @IsOptional()
  @IsString() // 可选字段,如果为null或undefined则跳过验证
  role?: string
}

// [ class-validator装饰器合集 ](https://juejin.cn/post/7132687601844092965)

// class-transformer 的 Exclude 装饰器用于排除字段，不返回给前端
//  @Exclude({ toClassOnly: true }) // 排除字段，不接收前端传递的值
// @Exclude({ toPlainOnly: true }) // 排除字段，不返回给前端，这个功能可以使用 prisma 的 select 来实现，所以我不太喜欢用这个
// 也可以看 prisma的文档如何排除字段 https://prisma.nodejs.cn/concepts/components/prisma-client/excluding-fields
