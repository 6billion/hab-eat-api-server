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
import {
  PostUserDto,
  PostUserResponseDto,
  UserDto,
} from './dtos/post-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Users } from '@prisma/client';
import { RequestUser } from '../request-user.decorator';
import { BearerGuard } from '../auth/guards/bearer.guard';
import { PutUserDto } from './dtos/put-user.dto';
import { User } from './user';
import { GetTargetNutrientsResponseDto } from './dtos/get-target-nutrients.dto';

@ApiTags('유저')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiBody({ type: PostUserDto })
  @ApiResponse({ type: PostUserResponseDto })
  @Post('kakao-login')
  async kakaoLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getKakaoUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @ApiBody({ type: PostUserDto })
  @ApiResponse({ type: PostUserResponseDto })
  @Post('naver-login')
  async naverLogin(@Body() body: PostUserDto) {
    const snsUser = await this.userService.getNaverUser(body.snsToken);
    return this.userService.signInOrUp(body, snsUser);
  }

  @ApiOperation({ summary: '유저 조회' })
  @ApiResponse({ type: UserDto })
  @Get()
  @UseGuards(BearerGuard)
  async getUser(@RequestUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: '목표 섭취 칼로리/영양분 조회' })
  @ApiResponse({ type: GetTargetNutrientsResponseDto })
  @Get('target-nutrients')
  @UseGuards(BearerGuard)
  async getUserTargetNutrients(@RequestUser() user: User) {
    return user.targetNutrients;
  }

  @ApiOperation({ summary: '유저 수정' })
  @ApiResponse({ type: PostUserResponseDto })
  @ApiBody({ type: PutUserDto, required: false })
  @Put()
  @UseGuards(BearerGuard)
  updateUser(@RequestUser() user: Users, @Body() body: PutUserDto) {
    return this.userService.updateUser(user.id, body);
  }

  @ApiOperation({ summary: '유저 탈퇴' })
  @Delete()
  @ApiResponse({ type: UserDto })
  @UseGuards(BearerGuard)
  async deleteUser(@RequestUser() user: Users) {
    return this.userService.deleteUser(user.id);
  }
}
