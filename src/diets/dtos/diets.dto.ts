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

export class GetDailyMealDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;
}

export class createDietDto {
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

export class deleteDietDto {
  @ApiProperty({ description: 'user ID', type: Number })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'date (YYYY-MM-DD)', type: Date })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'create time', type: Date })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'updated time', type: Date })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
