import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsDate,
} from 'class-validator';

export class GetDailyNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;
}

export class GetMealNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDateString()
  date: Date;
}

export class UpdateNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'food name', type: String })
  @IsString()
  foodName: string;
}

export class DeleteNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;

  @ApiProperty({ description: '���� �ð�', type: String })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ description: '������Ʈ �ð�', type: String })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
