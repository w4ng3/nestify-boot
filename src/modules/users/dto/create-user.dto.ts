import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @IsOptional() // 可选字段,如果为null或undefined则跳过验证
  @IsString()
  role?: string;
}

// [ class-validator装饰器合集 ](https://juejin.cn/post/7132687601844092965)
