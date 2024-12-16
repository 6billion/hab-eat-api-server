import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AutoCompleteResponseDto {
  @ApiProperty({ description: 'food Id', type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'food name', type: String })
  @IsString()
  name: string;
}
export class ClassNameResponseDto {
  @ApiProperty({ description: 'food name', type: String })
  @IsString()
  name: string;
}

export class SearchResponseDto {
  @ApiProperty({ description: 'food ID', type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'food name', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'food category', type: String })
  @IsString()
  category: string;

  @ApiProperty({ description: 'food servingSize', type: Number })
  @IsNumber()
  servingSize: number;

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
