import { Controller, Get, Query, Post, Body, Delete } from '@nestjs/common';
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
  @Post('update')
  async updateNutrition(
    @Body('userId') userId: number,
    @Body('date') date: string,
    @Body('foodName') foodName: string,
  ) {
    return await this.dietService.updateNutrition(userId, date, foodName);
  }
  @Delete('delete')
  async deleteNutrition(
    @Query('userId') userId: number,
    @Query('date') date: string,
    @Query('createdAt') createdAt: string,
    @Query('updatedAt') updatedAt: string,
  ) {
    const createdAtDate = new Date(createdAt);
    const updatedAtDate = new Date(updatedAt);

    return await this.dietService.deleteNutrition(
      userId,
      date,
      createdAtDate,
      updatedAtDate,
    );
  }
}
