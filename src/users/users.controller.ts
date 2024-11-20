import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PostUserDto } from './dtos/post-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Users } from '@prisma/client';
import { RequestUser } from '../request-user.decorator';
import { BearerGuard } from '../auth/guards/bearer.guard';
import { PutUserDto } from './dtos/put-user.dto';
import { User } from './user';

@ApiTags('유저')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiBody({ type: PostUserDto })
  @Post('kakao-login')
  async kakaoLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getKakaoUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @ApiBody({ type: PostUserDto })
  @Post('naver-login')
  async naverLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getNaverUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '유저 조회' })
  @Get()
  @UseGuards(BearerGuard)
  async getUser(@RequestUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: '목표 섭취 칼로리/영양분 조회' })
  @Get('target-nutrients')
  @UseGuards(BearerGuard)
  async getUserTargetNutrients(@RequestUser() user: User) {
    return user.targetNutrients;
  }

  @ApiOperation({ summary: '유저 수정' })
  @Put()
  @ApiBody({ type: PutUserDto, required: false })
  @UseGuards(BearerGuard)
  updateUser(@RequestUser() user: Users, @Body() body: PutUserDto) {
    return this.userService.updateUser(user.id, body);
  }

  @ApiOperation({ summary: '유저 탈퇴' })
  @Delete()
  @UseGuards(BearerGuard)
  async deleteUser(@RequestUser() user: Users) {
    await this.userService.deleteUser(user.id);
    return user;
  }
}
