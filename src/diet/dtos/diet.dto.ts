import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class GetDailyNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: String })
  @IsDateString()
  date: string;
}

export class GetMealNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: String })
  @IsDateString()
  date: string;
}

export class UpdateNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: String })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'food name', type: String })
  @IsString()
  foodName: string;
}

export class DeleteNutritionDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: String })
  @IsDateString()
  date: string;

  @ApiProperty({ description: '���� �ð�', type: String })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ description: '������Ʈ �ð�', type: String })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
