import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DietsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyAccumulation(userId: number, date: Date) {
    const totals = await this.prisma.dietStats.aggregate({
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
    return totals._sum;
  }

  async getDailyMeal(userId: number, date: Date) {
    const meals = await this.prisma.diets.findMany({
      where: {
        userId: userId,
        date: date,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const breakfast = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60 * 1000,
      );
      const hour = localTime.getHours();
      return hour >= 0 && hour < 11;
    });

    const lunch = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60 * 1000,
      );
      const hour = localTime.getHours();
      return hour >= 11 && hour < 17;
    });

    const dinner = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60 * 1000,
      );
      const hour = localTime.getHours();
      return hour >= 17;
    });

    return {
      breakfast,
      lunch,
      dinner,
    };
  }

  async createDiet(userId: number, date: Date, nutritionData: any) {
    const createdDiet = await this.prisma.diets.create({
      data: {
        userId,
        date,
        createdAt: new Date(),
        ...nutritionData,
      },
    });
    return createdDiet;
  }
  async deleteDiet(
    userId: number,
    date: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    await this.prisma.diets.deleteMany({
      where: {
        userId,
        date,
        createdAt,
      },
    });
    await this.prisma.dietStats.deleteMany({
      where: {
        userId,
        date,
        updatedAt,
      },
    });
  }
}
