import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyNutrition(userId: number) {
    const today = new Date().toISOString().slice(0, 10);

    const dailyNutrition = await this.prisma.dailyNutritions.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: new Date(today),
        },
      },
    });

    if (!dailyNutrition) {
      return { message: '오늘의 데이터가 없습니다.' };
    }

    return {
      userId: dailyNutrition.userId,
      date: dailyNutrition.date,
      kcal: dailyNutrition.kcal,
      carbohydrate: dailyNutrition.carbohydrate,
      sugar: dailyNutrition.sugar,
      fat: dailyNutrition.fat,
      protein: dailyNutrition.protein,
      calcium: dailyNutrition.calcium,
      phosphorus: dailyNutrition.phosphorus,
      natrium: dailyNutrition.natrium,
      kalium: dailyNutrition.kalium,
      magnesium: dailyNutrition.magnesium,
      iron: dailyNutrition.iron,
      zinc: dailyNutrition.zinc,
      cholesterol: dailyNutrition.cholesterol,
      transfat: dailyNutrition.transfat,
    };
  }
  async getMealNutrition(userId: number, date: string) {
    const meals = await this.prisma.mealNutritions.findMany({
      where: {
        userId: userId,
        date: new Date(date),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (meals.length === 0) {
      return { message: '해당 날짜에 식단 데이터가 없습니다.' };
    }
    const breakfast = meals.filter(
      (meal) => new Date(meal.createdAt).getHours() < 11,
    );
    const lunch = meals.filter(
      (meal) =>
        new Date(meal.createdAt).getHours() >= 11 &&
        new Date(meal.createdAt).getHours() < 17,
    );
    const dinner = meals.filter(
      (meal) => new Date(meal.createdAt).getHours() >= 17,
    );

    return {
      breakfast,
      lunch,
      dinner,
    };
  }
}
