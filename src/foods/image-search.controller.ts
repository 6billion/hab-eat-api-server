import { Controller, Post, Body } from '@nestjs/common';
import { ImageSearchAiService } from 'src/foods/image-search.service';
import { SearchImageDto } from './dtos/search-image.dto';
import { ImageSearchResponseDto } from './dtos/image-search-response.dto';

@Controller('image-search-ai')
export class ImageSearchAiController {
  constructor(private readonly imageSearchAiService: ImageSearchAiService) {}

  @Post('get-image-name')
  async getImageName(
    @Body() searchImageDto: SearchImageDto,
  ): Promise<ImageSearchResponseDto> {
    const { key } = searchImageDto;
    const name = await this.imageSearchAiService.getImageNameFromAi(key);
    return { name };
  }
}
