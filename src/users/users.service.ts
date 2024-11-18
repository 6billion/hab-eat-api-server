import { Injectable } from '@nestjs/common';
import { PostUserDto } from './post-user.dto';

@Injectable()
export class UsersService {
  async signInOrUp(dto: PostUserDto) {
    return dto;
  }
}
