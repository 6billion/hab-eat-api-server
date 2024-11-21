import { Controller, Get, Query } from '@nestjs/common';
import { DietService } from './diet.service';

@Controller('diet')
export class DietController {
  constructor(private readonly dietService: DietService) {}

  @Get('daily')
  async getDailyNutrition(
    @Query('userId') userId: number,
    @Query('date') date: string,
  ) {
    return this.dietService.getDailyNutrition(userId, date);
  }
  @Get('meals')
  async getMealNutrition(
    @Query('userId') userId: number,
    @Query('date') date: string,
  ) {
    return this.dietService.getMealNutrition(userId, date);
  }
}
