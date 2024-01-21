import { Injectable } from '@nestjs/common'
import { CreateLoginDto } from './dto/create-login.dto'

@Injectable()
export class LoginService {
  create(createLoginDto: CreateLoginDto) {
    return 'This action adds a new login'
  }

  findAll() {
    return `This action returns all login`
  }
}
