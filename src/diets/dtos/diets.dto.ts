import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateDailyAccumulationDto {
  @IsNumber()
  userId: number;

  @IsDate()
  date: Date;
}

export class GetDailyAccumulationDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;
}

export class GetDailyMealDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;
}

export class CreateDietDto {
  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Date of the meal' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Amount of food consumed' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Calories of the consumed food' })
  @IsNumber()
  kcal: number;

  @ApiProperty({ description: 'Carbohydrates of the consumed food' })
  @IsNumber()
  carbohydrate: number;

  @ApiProperty({ description: 'Sugar content of the consumed food' })
  @IsNumber()
  sugar: number;

  @ApiProperty({ description: 'Fat content of the consumed food' })
  @IsNumber()
  fat: number;

  @ApiProperty({ description: 'Protein content of the consumed food' })
  @IsNumber()
  protein: number;

  @ApiProperty({ description: 'Calcium content of the consumed food' })
  @IsNumber()
  calcium: number;

  @ApiProperty({ description: 'Phosphorus content of the consumed food' })
  @IsNumber()
  phosphorus: number;

  @ApiProperty({ description: 'Sodium content of the consumed food' })
  @IsNumber()
  natrium: number;

  @ApiProperty({ description: 'Potassium content of the consumed food' })
  @IsNumber()
  kalium: number;

  @ApiProperty({ description: 'Magnesium content of the consumed food' })
  @IsNumber()
  magnesium: number;

  @ApiProperty({ description: 'Iron content of the consumed food' })
  @IsNumber()
  iron: number;

  @ApiProperty({ description: 'Zinc content of the consumed food' })
  @IsNumber()
  zinc: number;

  @ApiProperty({ description: 'Cholesterol content of the consumed food' })
  @IsNumber()
  cholesterol: number;

  @ApiProperty({ description: 'Trans fat content of the consumed food' })
  @IsNumber()
  transfat: number;
}

export class DeleteDietDto {
  @ApiProperty({ description: 'Diet entry ID', type: Number })
  @IsNumber()
  dietId: number;

  @ApiProperty({ description: 'User ID', type: Number })
  @IsNumber()
  userId: number;
}
export class GetPresignedUrlRequestDto {
  @ApiProperty({ description: '개수', type: Number, required: false })
  @IsNumber()
  @IsOptional()
  count?: number = 1;
}

export class GetPresignedUrlResponseDto {
  @ApiProperty({ description: 'presigned-url key', type: String })
  url: string;

  @ApiProperty({ description: 'presigned-url key', type: String })
  key: string;
}
