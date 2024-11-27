import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}
  async autoComplete(keyword: string) {
    const results = await this.prisma.food.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      take: 5,
      select: {
        name: true,
      },
    });
    return results;
  }
  async searchDiet(foodName: string) {
    const food = await this.prisma.food.findUnique({
      where: { name: foodName },
    });

    return food;
  }
}
