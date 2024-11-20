import { Module } from '@nestjs/common';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';
import { PrismaService } from '../db/prisma.service';

@Module({
  controllers: [DietController],
  providers: [DietService, PrismaService],
})
export class DietModule {}
