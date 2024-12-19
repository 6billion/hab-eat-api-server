import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'sns 토큰', type: String })
  @IsString()
  snsToken: string;

  @ApiProperty({ description: '닉네임', type: String, required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '키', type: Number })
  @IsNumber()
  height: number;

  @ApiProperty({ description: '몸무게', type: Number })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: '나이', type: Number, default: 25 })
  @IsNumber()
  @IsOptional()
  age: number = 25;

  @ApiProperty({ description: '성별', enum: $Enums.Sex })
  @IsEnum($Enums.Sex)
  sex: $Enums.Sex;

  @ApiProperty({ description: '유저 타입', enum: $Enums.UserType })
  @IsEnum($Enums.UserType)
  type: $Enums.UserType;

  @ApiProperty({
    description: '활동 레벨',
    enum: $Enums.UserActivityLevel,
    required: false,
  })
  @IsEnum($Enums.UserActivityLevel)
  @IsOptional()
  activityLevel: $Enums.UserActivityLevel;

  @ApiProperty({ description: 'fcm token', type: String, required: false })
  @IsString()
  @IsOptional()
  fcmToken?: string;
}

export class UserDto {
  @ApiProperty({
    description: '유저 고유 아이디',
    type: String,
    required: false,
  })
  id: string;

  @ApiProperty({ description: '닉네임', type: String })
  nickname: string;

  @ApiProperty({ description: '키', type: Number })
  height: number;

  @ApiProperty({ description: '몸무게', type: Number })
  weight: number;

  @ApiProperty({ description: '나이', type: Number })
  age: number;

  @ApiProperty({ description: '성별', enum: $Enums.Sex })
  sex: $Enums.Sex;

  @ApiProperty({
    description: '유저 타입',
    enum: $Enums.UserType,
    required: false,
  })
  type: $Enums.UserType;

  @ApiProperty({
    description: '활동 레벨',
    enum: $Enums.UserActivityLevel,
    required: false,
  })
  activityLevel: $Enums.UserActivityLevel;

  @ApiProperty({ description: 'fcm토큰', type: String, required: false })
  @IsString()
  @IsOptional()
  fcmToken?: string;
}

export class PostUserResponseDto {
  @ApiProperty({ description: '유저', type: UserDto })
  user: UserDto;

  @ApiProperty({ description: '토큰', type: String })
  token: string;
}
