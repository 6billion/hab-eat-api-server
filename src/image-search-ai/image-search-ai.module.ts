import { Module } from '@nestjs/common';
import { ImageSearchAiService } from 'src/image-search-ai/image-search/image-search.service';
import { ImageSearchAiController } from 'src/image-search-ai/image-search/image-search.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ImageSearchAiController],
  providers: [ImageSearchAiService],
})
export class ImageSearchModule {}
