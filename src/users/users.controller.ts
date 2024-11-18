import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUserDto } from './dtos/post-user.dto';
import { ApiTags } from '@nestjs/swagger';

import { Users } from '@prisma/client';
import { RequestUser } from 'src/request-user.decorator';
import { BearerGuard } from 'src/auth/guards/bearer.guard';

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

  @Get()
  @UseGuards(BearerGuard)
  async getUser(@RequestUser() user: Users) {
    return user;
  }
}
