import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BearerGuard } from '../auth/guards/bearer.guard';

@ApiTags('Foods')
@ApiBearerAuth()
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get('autocomplete')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Get auto-complete food names based on keyword' })
  async getAutoComplete(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.foodsService.autoComplete(keyword, page, limit);
  }

  @Get(':id')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Search food details by food Id' })
  async getSearchDiet(@Param('id') id: number) {
    return await this.foodsService.searchDiet(id);
  }
}
