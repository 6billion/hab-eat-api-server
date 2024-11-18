import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUserDto } from './dtos/post-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Users } from '@prisma/client';
import { RequestUser } from '../request-user.decorator';
import { BearerGuard } from '../auth/guards/bearer.guard';

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '페이스북 로그인' })
  @ApiBody({ type: PostUserDto })
  @Post('facebook-login')
  async facebookLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getFacebookUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '구글 로그인' })
  @ApiBody({ type: PostUserDto })
  @Post('google-login')
  async gooleLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getGoolgeUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '유저 조회' })
  @Get()
  @UseGuards(BearerGuard)
  async getUser(@RequestUser() user: Users) {
    return user;
  }

  @ApiOperation({ summary: '유저 탈퇴' })
  @Delete()
  @UseGuards(BearerGuard)
  async deleteUser(@RequestUser() user: Users) {
    await this.userService.deleteUser(user.id);
    return user;
  }
}
