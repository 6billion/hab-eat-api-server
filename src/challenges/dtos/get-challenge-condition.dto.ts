import { ApiProperty } from '@nestjs/swagger';
import { NutriChallengeCondition } from 'src/constants';

class ThresholdDto {
  @ApiProperty({
    description: '목표 섭취 칼로리',
    type: Number,
    required: false,
  })
  kcal: number | null;

  @ApiProperty({
    description: '목표 섭취 탄수화물',
    type: Number,
    required: false,
  })
  carbohydrate: number | null;

  @ApiProperty({
    description: '목표 섭취 단백질',
    type: Number,
    required: false,
  })
  protein: number | null;

  @ApiProperty({
    description: '목표 섭취 지방',
    type: Number,
    required: false,
  })
  fat: number | null;

  @ApiProperty({
    description: '목표 섭취 나트륨',
    type: Number,
    required: false,
  })
  natrium: number | null;

  @ApiProperty({
    description: '목표 섭취 콜레스트롤',
    type: Number,
    required: false,
  })
  cholesterol: number | null;

  @ApiProperty({
    description: '목표 섭취 당',
    type: Number,
    required: false,
  })
  sugar: number | null;
}

export class GetChallengeConditonResponseDto {
  @ApiProperty({ description: '영양 섭취 챌린지 기준값', type: ThresholdDto })
  threshold: ThresholdDto;

  @ApiProperty({
    description:
      'gte: 기준값 이상 섭취한 경우 성공, lte: 기준값 미만 섭취한 경우 성공',
    enum: NutriChallengeCondition,
  })
  condition: NutriChallengeCondition;
}
