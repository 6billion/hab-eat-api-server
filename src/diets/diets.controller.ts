import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common';
import { DietsService } from './diets.service';
import {
  GetDailyNutritionDto,
  GetMealNutritionDto,
  UpdateNutritionDto,
  DeleteNutritionDto,
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
  @ApiOperation({ summary: 'Update nutrition' })
  async updateNutrition(@Body() updateNutritionDto: UpdateNutritionDto) {
    const { userId, date, foodName } = updateNutritionDto;
    const dateObj = new Date(date);
    return await this.dietsService.updateNutrition(userId, dateObj, foodName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete nutrition' })
  async deleteNutrition(@Query() params: DeleteNutritionDto) {
    const { userId, date, createdAt, updatedAt } = params;
    const dateObj = new Date(date);
    const createdAtDate = createdAt ? new Date(createdAt) : undefined;
    const updatedAtDate = updatedAt ? new Date(updatedAt) : undefined;

    return await this.dietsService.deleteNutrition(
      userId,
      dateObj,
      createdAtDate,
      updatedAtDate,
    );
  }
}
