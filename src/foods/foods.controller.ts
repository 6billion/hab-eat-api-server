import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BearerGuard } from '../auth/guards/bearer.guard';

@ApiTags('Food')
@ApiBearerAuth()
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get('autoComplete')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Get auto-complete food names based on keyword' })
  async getAutoComplete(@Query('keyword') keyword: string) {
    return this.foodsService.autoComplete(keyword);
  }

  @Get(':name')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'Search food details by food name' })
  async getSearchDiet(@Param('name') name: string) {
    return await this.foodsService.searchDiet(name);
  }
}
