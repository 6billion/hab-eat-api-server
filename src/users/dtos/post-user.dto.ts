import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUserDto {
  @ApiProperty({ description: 'sns 토큰', type: String })
  @IsString()
  snsToken: string;

  @ApiProperty({ description: '닉네임', type: String })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '키', type: String })
  @IsNumber()
  @IsOptional()
  hight?: number;

  @ApiProperty({ description: '몸무게', type: Number })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: '목표 칼로리', type: Number })
  @IsNumber()
  @IsOptional()
  goalKcal?: number;
}
