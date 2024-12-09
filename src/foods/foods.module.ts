import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from 'src/foods/foods.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
