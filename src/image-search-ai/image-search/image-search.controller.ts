import { Controller, Post, Body } from '@nestjs/common';
import { ImageSearchAiService } from 'src/image-search-ai/image-search/image-search.service';
import { SearchImageDto } from '../dtos/search-image.dto';
import { ImageSearchResponseDto } from '../dtos/image-search-response.dto';

@Controller('image-search-ai')
export class ImageSearchAiController {
  constructor(private readonly imageSearchAiService: ImageSearchAiService) {}

  @Post('get-image-name')
  async getImageName(
    @Body() searchImageDto: SearchImageDto,
  ): Promise<ImageSearchResponseDto> {
    const { key, aiModelId } = searchImageDto;
    const name = await this.imageSearchAiService.getImageNameFromAi(
      aiModelId,
      key,
    );
    return { name };
  }
}
