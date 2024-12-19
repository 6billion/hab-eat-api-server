import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'sns 토큰', type: String })
  @IsString()
  snsToken: string;

  @ApiProperty({
    description: '닉네임',
    type: String,
    default: '햅잇',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname?: string = '햅잇';

  @ApiProperty({
    description: '키',
    type: Number,
    default: 180,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  height?: number = 180;

  @ApiProperty({
    description: '몸무게',
    type: Number,
    default: 80,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number = 80;

  @ApiProperty({
    description: '나이',
    type: Number,
    default: 25,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  age?: number = 25;

  @ApiProperty({
    description: '성별',
    enum: $Enums.Sex,
    default: $Enums.Sex.male,
    required: false,
  })
  @IsEnum($Enums.Sex)
  @IsOptional()
  sex?: $Enums.Sex = $Enums.Sex.male;

  @ApiProperty({
    description: '유저 타입',
    enum: $Enums.UserType,
    default: $Enums.UserType.maintain,
    required: false,
  })
  @IsEnum($Enums.UserType)
  @IsOptional()
  type?: $Enums.UserType = $Enums.UserType.maintain;

  @ApiProperty({
    description: '활동 레벨',
    enum: $Enums.UserActivityLevel,
    default: $Enums.UserActivityLevel.moderatelyActive,
    required: false,
  })
  @IsEnum($Enums.UserActivityLevel)
  @IsOptional()
  activityLevel?: $Enums.UserActivityLevel =
    $Enums.UserActivityLevel.moderatelyActive;
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
}

export class PostUserResponseDto {
  @ApiProperty({ description: '유저', type: UserDto })
  user: UserDto;

  @ApiProperty({ description: '토큰', type: String })
  token: string;

  @ApiProperty({ description: '유저 생성 여부', type: Boolean })
  isNew: boolean;
}
