import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DietsService } from './diets.service';
import {
  GetDailyNutritionDto,
  GetMealNutritionDto,
  createDietDto,
  deleteDietDto,
} from 'src/diets/dtos/diets.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BearerGuard } from '../auth/guards/bearer.guard';

@ApiTags('Diet')
@ApiBearerAuth()
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Get('stats')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Get daily nutrition' })
  async getDailyNutrition(@Query() params: GetDailyNutritionDto) {
    const { userId, date } = params;
    const parsedDate = new Date(date);
    return await this.dietsService.getDailyNutrition(userId, parsedDate);
  }

  @Get()
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Get meal nutrition' })
  async getMealNutrition(@Query() params: GetMealNutritionDto) {
    const { userId, date } = params;
    const dateObj = new Date(date);
    return await this.dietsService.getMealNutrition(userId, dateObj);
  }

  @Post()
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'create Diet' })
  async createDiet(@Body() createDietDto: createDietDto) {
    const { userId, date, foodName } = createDietDto;
    const dateObj = new Date(date);
    return await this.dietsService.createDiet(userId, dateObj, foodName);
  }

  @Delete(':id')
  @UseGuards(BearerGuard)
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
