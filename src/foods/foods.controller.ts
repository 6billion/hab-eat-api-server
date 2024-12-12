import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BearerGuard } from '../auth/guards/bearer.guard';
import { SearchImageDto } from './dtos/search-image.dto';
import { ImageSearchResponseDto } from './dtos/image-search-response.dto';
import {
  GetPresignedUrlRequestDto,
  GetPresignedUrlResponseDto,
} from 'src/diets/dtos/diets.dto';
import { Users } from '@prisma/client';
import { RequestUser } from 'src/request-user.decorator';

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

  @Post('class-names')
  async getImageName(
    @Body() searchImageDto: SearchImageDto,
  ): Promise<ImageSearchResponseDto> {
    const { key } = searchImageDto;
    const name = await this.foodsService.getImageNameFromAi(key);
    return { name };
  }

  @Get('presigned-urls')
  @UseGuards(BearerGuard)
  @ApiOperation({ summary: 'get presigned url' })
  @ApiResponse({ type: GetPresignedUrlResponseDto })
  getChallengePreSignedUrls(
    @Query() { count }: GetPresignedUrlRequestDto,
    @RequestUser() { id }: Users,
  ) {
    return this.foodsService.getPreSignedUrls(id, count);
  }
}
