import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType() 函数接受一个类作为参数，并创建一个新类，该类具有与原始类相同的属性，但是它们都是可选的。
export class UpdateUserDto extends PartialType(CreateUserDto) {}
