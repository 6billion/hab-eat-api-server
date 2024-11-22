import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DietService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyNutrition(userId: number, date: string) {
    const dailyNutrition = await this.prisma.dailyNutritions.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: date,
        },
      },
    });
    if (!dailyNutrition) {
      return { message: '${date}의 데이터가 없습니다.' };
    }
    return dailyNutrition;
  }

  async getMealNutrition(userId: number, date: string) {
    const meals = await this.prisma.mealNutritions.findMany({
      where: {
        userId: userId,
        date: date,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (meals.length === 0) {
      return { message: '해당 날짜에 식단 데이터가 없습니다.' };
    }

    const breakfast = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60000,
      );
      const hour = localTime.getHours();
      return hour >= 0 && hour < 11;
    });

    const lunch = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60000,
      );
      const hour = localTime.getHours();
      return hour >= 11 && hour < 17;
    });

    const dinner = meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      const localTime = new Date(
        mealDate.getTime() + mealDate.getTimezoneOffset() * 60000,
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
  async updateNutrition(userId: number, date: string, foodName: string) {
    const foodData = await this.prisma.food.findUnique({
      where: { name: foodName },
    });

    if (!foodData) {
      throw new Error('해당 음식이 존재하지 않습니다.');
    }
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
      data: nutritionData,
      updatedAt: new Date(),
    });
  }
  async deleteNutrition(
    userId: number,
    date: string,
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
