import { ApiProperty } from '@nestjs/swagger';

export class GetTargetNutrientsResponseDto {
  @ApiProperty({ description: '목표 섭취 칼로리', type: Number })
  kcal: number;

  @ApiProperty({ description: '목표 섭취 탄수화물', type: Number })
  carbohydrate: number;

  @ApiProperty({ description: '목표 섭취 단백질', type: Number })
  protein: number;

  @ApiProperty({ description: '목표 섭취 지방', type: Number })
  fat: number;

  @ApiProperty({ description: '목표 섭취 나트륨', type: Number })
  natrium: number;

  @ApiProperty({ description: '목표 섭취 콜레스트롤', type: Number })
  cholesterol: number;

  @ApiProperty({ description: '목표 섭취 당', type: Number })
  sugar: number;
}
