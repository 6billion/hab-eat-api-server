import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common';
import { DietService } from './diet.service';
import {
  GetDailyNutritionDto,
  GetMealNutritionDto,
  UpdateNutritionDto,
  DeleteNutritionDto,
} from 'src/diet/dtos/diet.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Diet')
@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily nutrition' })
  async getDailyNutrition(@Query() params: GetDailyNutritionDto) {
    const { userId, date } = params;
    const parsedDate = new Date(date);
    return await this.dietService.getDailyNutrition(userId, parsedDate);
  }

  @Get('meals')
  @ApiOperation({ summary: 'Get meal nutrition' })
  async getMealNutrition(@Query() params: GetMealNutritionDto) {
    const { userId, date } = params;
    const dateObj = new Date(date);
    return await this.dietService.getMealNutrition(userId, dateObj);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update nutrition' })
  async updateNutrition(@Body() updateNutritionDto: UpdateNutritionDto) {
    const { userId, date, foodName } = updateNutritionDto;
    const dateObj = new Date(date);
    return await this.dietService.updateNutrition(userId, dateObj, foodName);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete nutrition' })
  async deleteNutrition(@Query() params: DeleteNutritionDto) {
    const { userId, date, createdAt, updatedAt } = params;
    const dateObj = new Date(date);
    const createdAtDate = createdAt ? new Date(createdAt) : undefined;
    const updatedAtDate = updatedAt ? new Date(updatedAt) : undefined;

    return await this.dietService.deleteNutrition(
      userId,
      dateObj,
      createdAtDate,
      updatedAtDate,
    );
  }
}
