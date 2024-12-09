import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNumber } from 'class-validator';
import { PostParticipantsResponseDto } from './post-participants.dto';

export class PostChallengeCertificationRequestDto {
  @ApiProperty({ description: 'S3 이미지 Key', type: String })
  @IsString()
  key: string;
}

export class PostNutritionChallengesCertificationRequestDto {
  @ApiProperty({ description: '당일 섭취 칼로리', type: Number })
  @IsNumber()
  kcal: number;

  @ApiProperty({ description: '당일 섭취 탄수화물', type: Number })
  @IsNumber()
  carbohydrate: number;

  @ApiProperty({ description: '당일 섭취 단백질', type: Number })
  @IsNumber()
  protein: number;

  @ApiProperty({ description: '당일 섭취 지방', type: Number })
  @IsNumber()
  fat: number;

  @ApiProperty({ description: '당일 섭취 나트륨', type: Number })
  @IsNumber()
  natrium: number;

  @ApiProperty({ description: '당일 섭취 콜레스트롤', type: Number })
  @IsNumber()
  cholesterol: number;

  @ApiProperty({ description: '당일 섭취 당', type: Number })
  @IsNumber()
  sugar: number;
}

export class PostChallengesCertificationResponseDto extends PostParticipantsResponseDto {}
