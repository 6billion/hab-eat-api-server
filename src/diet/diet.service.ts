import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyNutrition(userId: number, date: Date) {
    const totals = await this.prisma.dailyNutritions.aggregate({
      _sum: {
        amount: true,
        kcal: true,
        carbohydrate: true,
        sugar: true,
        fat: true,
        protein: true,
        calcium: true,
        phosphorus: true,
        natrium: true,
        kalium: true,
        magnesium: true,
        iron: true,
        zinc: true,
        cholesterol: true,
        transfat: true,
      },
      where: {
        userId: userId,
        date: date,
      },
    });
    return dailyNutrition;
  }

  async getMealNutrition(userId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const timeRanges = [
      { name: 'Breakfast', start: 5, end: 11 },
      { name: 'Lunch', start: 12, end: 16 },
      { name: 'Dinner', start: 17, end: 22 },
    ];

    const results = [];

    for (const range of timeRanges) {
      const rangeStart = new Date(startOfDay);
      const rangeEnd = new Date(startOfDay);

      rangeStart.setHours(range.start, 0, 0, 0);
      rangeEnd.setHours(range.end, 59, 59, 999);

      const totals = await this.prisma.mealNutritions.aggregate({
        _sum: {
          amount: true,
          kcal: true,
          carbohydrate: true,
          sugar: true,
          fat: true,
          protein: true,
          calcium: true,
          phosphorus: true,
          natrium: true,
          kalium: true,
          magnesium: true,
          iron: true,
          zinc: true,
          cholesterol: true,
          transfat: true,
        },
        where: {
          userId: userId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          createdAt: {
            gte: rangeStart,
            lte: rangeEnd,
          },
        },
      });

      results.push({
        mealType: range.name,
        totals: totals._sum,
      });
    }

    return results;
  }
  async updateNutrition(userId: number, date: Date, foodName: string) {
    const foodData = await this.prisma.food.findUnique({
      where: { name: foodName },
    });

    const nutritionData = {
      userId,
      date,
      amount: foodData.amount,
      kcal: foodData.kcal,
      carbohydrate: foodData.carbohydrate,
      sugar: foodData.sugar,
      fat: foodData.fat,
      protein: foodData.protein,
      calcium: foodData.calcium,
      phosphorus: foodData.phosphorus,
      natrium: foodData.natrium,
      kalium: foodData.kalium,
      magnesium: foodData.magnesium,
      iron: foodData.iron,
      zinc: foodData.zinc,
      cholesterol: foodData.cholesterol,
      transfat: foodData.transfat,
    };
    await this.prisma.mealNutritions.create({
      data: {
        ...nutritionData,
        createdAt: new Date(),
      },
    });
    await this.prisma.dailyNutritions.create({
      data: {
        ...nutritionData,
        updatedAt: new Date(),
      },
    });
  }
  async deleteNutrition(
    userId: number,
    date: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    await this.prisma.mealNutritions.deleteMany({
      where: {
        userId,
        date,
        createdAt,
      },
    });
    await this.prisma.dailyNutritions.deleteMany({
      where: {
        userId,
        date,
        updatedAt,
      },
    });
  }
}
