import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PutUserDto {
  @ApiProperty({ description: '닉네임', type: String, required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '키', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  height: number;

  @ApiProperty({ description: '몸무게', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  weight: number;

  @ApiProperty({ description: '나이', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiProperty({ description: '성별', type: String, required: false })
  @IsOptional()
  @IsEnum($Enums.Sex)
  sex: $Enums.Sex;

  @ApiProperty({ description: '유저 타입', type: String, required: false })
  @IsOptional()
  @IsEnum($Enums.UserType)
  type: $Enums.UserType;

  @ApiProperty({ description: '활동 레벨', type: String, required: false })
  @IsEnum($Enums.UserActivityLevel)
  @IsOptional()
  activityLevel: $Enums.UserActivityLevel;

  @ApiProperty({ description: '질병 여부', type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  hasDisease: boolean;
}
