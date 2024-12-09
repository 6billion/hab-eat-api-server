import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { PrismaService } from '../db/prisma.service';
import { FoodsController } from 'src/foods/foods.controller';
import { ImageSearchAiService } from 'src/foods/image-search.service';
import { ImageSearchAiController } from 'src/foods/image-search.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FoodsController, ImageSearchAiController],
  providers: [FoodsService, PrismaService, ImageSearchAiService],
  exports: [FoodsService, ImageSearchAiService],
})
export class FoodModule {}
