import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UtilService } from 'libs/util/src/util.service';
import * as dayjs from 'dayjs';

@Injectable()
export class DietsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilService: UtilService,
  ) {}
  async updateDailyAccumulation(userId: number, date: Date) {
    const diets = await this.prisma.diets.findMany({
      where: {
        userId,
        date,
      },
    });

    const totals = diets.reduce(
      (acc, diet) => {
        acc.amount += diet.amount;
        acc.kcal += diet.kcal;
        acc.carbohydrate += diet.carbohydrate;
        acc.sugar += diet.sugar;
        acc.fat += diet.fat;
        acc.protein += diet.protein;
        acc.calcium += diet.calcium;
        acc.phosphorus += diet.phosphorus;
        acc.natrium += diet.natrium;
        acc.kalium += diet.kalium;
        acc.magnesium += diet.magnesium;
        acc.iron += diet.iron;
        acc.zinc += diet.zinc;
        acc.cholesterol += diet.cholesterol;
        acc.transfat += diet.transfat;
        return acc;
      },
      {
        amount: 0,
        kcal: 0,
        carbohydrate: 0,
        sugar: 0,
        fat: 0,
        protein: 0,
        calcium: 0,
        phosphorus: 0,
        natrium: 0,
        kalium: 0,
        magnesium: 0,
        iron: 0,
        zinc: 0,
        cholesterol: 0,
        transfat: 0,
      },
    );

    await this.prisma.dietStats.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        ...totals,
      },
      create: {
        userId,
        date,
        ...totals,
      },
    });
  }

  async getDailyAccumulation(userId: number, date: Date) {
    const totals = await this.prisma.dietStats.findFirst({
      where: {
        userId: userId,
        date: date,
      },
    });
    return totals;
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
      const kstTime = this.utilService.convertUtcToKst(meal.createdAt);
      const hour = dayjs(kstTime).hour();
      return hour >= 0 && hour < 11;
    });

    const lunch = meals.filter((meal) => {
      const kstTime = this.utilService.convertUtcToKst(meal.createdAt);
      const hour = dayjs(kstTime).hour();
      return hour >= 11 && hour < 17;
    });

    const dinner = meals.filter((meal) => {
      const kstTime = this.utilService.convertUtcToKst(meal.createdAt);
      const hour = dayjs(kstTime).hour();
      return hour >= 17 && hour < 24;
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
        ...nutritionData,
      },
    });
    await this.updateDailyAccumulation(userId, date);
    return createdDiet;
  }
  async deleteDiet(userId: number, dietId: number) {
    await this.prisma.diets.deleteMany({
      where: {
        userId,
        id: dietId,
      },
    });
  }
}
