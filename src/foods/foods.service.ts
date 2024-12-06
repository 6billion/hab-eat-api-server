import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}
  async searchDiet(foodName: string) {
    const food = await this.prisma.foods.findFirst({
      where: { name: foodName },
    });

    return food;
  }
  async autoComplete(keyword: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const result = await this.prisma.foods.findMany({
      where: {
        name: {
          search: keyword,
        },
      },
      skip: offset,
      take: limit,
      select: {
        name: true,
      },
    });

    return result;
  }
}
