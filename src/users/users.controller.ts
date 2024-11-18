import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUserDto } from './post-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  signInOrUp(@Body() body: PostUserDto) {
    return this.userService.signInOrUp(body);
  }
}
