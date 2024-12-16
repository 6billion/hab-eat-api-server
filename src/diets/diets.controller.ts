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
  GetDailyAccumulationDto,
  GetDailyMealDto,
  CreateDietDto,
  DeleteDietDto,
} from 'src/diets/dtos/diets.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BearerGuard } from '../auth/guards/bearer.guard';
import { Users } from '@prisma/client';
import { RequestUser } from 'src/request-user.decorator';

@ApiTags('Diet')
@ApiBearerAuth()
@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Get('stats')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Get daily nutrition' })
  @ApiResponse({ type: GetDailyAccumulationDto })
  async getDailyAccumulation(
    @RequestUser() user: Users,
    @Query() query: GetDailyAccumulationDto,
  ) {
    const { date } = query;
    const userId = user.id;
    return await this.dietsService.getDailyAccumulation(userId, date);
  }

  @Get()
  @UseGuards(BearerGuard)
  @ApiOperation({
    summary: 'Get a list of meal for breakfast, lunch, and dinner.',
  })
  @ApiResponse({ type: GetDailyMealDto })
  async getDailyMeal(
    @RequestUser() user: Users,
    @Query() params: GetDailyMealDto,
  ) {
    const userId = user.id;
    const { date } = params;
    return await this.dietsService.getDailyMeal(userId, date);
  }

  @Delete(':id')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'delete Diet' })
  @ApiResponse({ type: DeleteDietDto })
  async deleteDiet(
    @RequestUser() user: Users,
    @Body() deleteDietDto: DeleteDietDto,
  ) {
    return await this.dietsService.deleteDiet(user.id, deleteDietDto.dietId);
  }
  @Post()
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Create nutritional information' })
  @ApiResponse({ type: CreateDietDto })
  async createDiet(
    @RequestUser() user: Users,
    @Body() createDietDto: CreateDietDto,
  ) {
    const { date, ...nutritionData } = createDietDto;
    return await this.dietsService.createDiet(user.id, date, nutritionData);
  }
}
