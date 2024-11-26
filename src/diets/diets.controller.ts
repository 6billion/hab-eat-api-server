import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common';
import { DietsService } from './diets.service';
import {
  GetDailyNutritionDto,
  GetMealNutritionDto,
  createDietDto,
  deleteDietDto,
} from 'src/diets/dtos/diets.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Diet')
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get daily nutrition' })
  async getDailyNutrition(@Query() params: GetDailyNutritionDto) {
    const { userId, date } = params;
    const parsedDate = new Date(date);
    return await this.dietsService.getDailyNutrition(userId, parsedDate);
  }

  @Get('meals')
  @ApiOperation({ summary: 'Get meal nutrition' })
  async getMealNutrition(@Query() params: GetMealNutritionDto) {
    const { userId, date } = params;
    const dateObj = new Date(date);
    return await this.dietsService.getMealNutrition(userId, dateObj);
  }

  @Post()
  @ApiOperation({ summary: 'create Diet' })
  async createDiet(@Body() createDietDto: createDietDto) {
    const { userId, date, foodName } = createDietDto;
    const dateObj = new Date(date);
    return await this.dietsService.createDiet(userId, dateObj, foodName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete Diet' })
  async deleteDiet(@Query() params: deleteDietDto) {
    const { userId, date, createdAt, updatedAt } = params;
    const dateObj = new Date(date);
    const createdAtDate = createdAt ? new Date(createdAt) : undefined;
    const updatedAtDate = updatedAt ? new Date(updatedAt) : undefined;

    return await this.dietsService.deleteDiet(
      userId,
      dateObj,
      createdAtDate,
      updatedAtDate,
    );
  }
}
