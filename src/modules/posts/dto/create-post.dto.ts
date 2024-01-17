import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsNumber()
  authorId?: number;
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
