import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @ApiProperty({ description: '나이', type: Number })
  @IsNumber()
  age: number;

  @ApiProperty({ description: '성별', type: String })
  @IsEnum($Enums.Sex)
  sex: $Enums.Sex;

  @ApiProperty({ description: '유저 타입', type: String })
  @IsEnum($Enums.UserType)
  type: $Enums.UserType;

  @ApiProperty({ description: '활동 레벨', type: String, required: false })
  @IsEnum($Enums.UserActivityLevel)
  activityLevel: $Enums.UserActivityLevel;

  @ApiProperty({ description: '질병 여부', type: Boolean })
  @IsBoolean()
  hasDisease: boolean;
}
