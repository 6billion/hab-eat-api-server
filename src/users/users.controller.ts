import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUserDto } from './dtos/post-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('배너')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('facebook-login')
  async facebookLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getFacebookUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @Post('google-login')
  async gooleLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getGoolgeUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }
}
