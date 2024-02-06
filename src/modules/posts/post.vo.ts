import { IntersectionType } from '@nestjs/swagger'
import { CreatePostDto } from './post.dto'
import { BaseVo } from '@/common/model/params'

export class PostVo extends IntersectionType(CreatePostDto, BaseVo) {}
