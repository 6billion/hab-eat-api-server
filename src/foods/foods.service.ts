import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}
  async searchDiet(foodName: string) {
    const food = await this.prisma.foods.findUnique({
      where: { name: foodName },
    });

    return food;
  }
  async fullTextSearch(keyword: string) {
    const result = await this.prisma.$queryRaw`
      SELECT name FROM Foods WHERE MATCH(name) AGAINST(${keyword}) LIMIT 10`;
    return result;
  }
  async autoComplete(keyword: string) {
    const result = await this.prisma.$queryRaw`
    SELECT name FROM Foods WHERE name LIKE ${'%' + keyword + '%'} LIMIT 10`;
    return result;
  }
}
