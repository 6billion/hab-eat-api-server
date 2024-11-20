import { $Enums, Users } from '@prisma/client';

export class User {
  id: number;
  nickname: string;
  height: number;
  weight: number;
  age: number;
  sex: $Enums.Sex;
  type: $Enums.UserType;
  activityLevel: $Enums.UserActivityLevel;
  hasDisease: boolean;
  createdAt: Date;

  get targetNutrients() {
    const kcal = this.targetCalories;

    let carbohydrate: number;
    let protein: number;
    let fat: number;

    const natrium = 2000;
    const cholesterol = 200;

    const sugar = this.hasDisease ? kcal / 80 : kcal / 40;

    switch (this.type) {
      case $Enums.UserType.bulk:
        carbohydrate = kcal * 0.1;
        protein = kcal * 0.1;
        fat = kcal * 0.022;
        break;

      case $Enums.UserType.diet:
        carbohydrate = kcal * 0.125;
        protein = kcal * 0.075;
        fat = kcal * 0.022;
        break;

      case $Enums.UserType.maintain:
        carbohydrate = kcal * 0.15;
        protein = kcal * 0.05;
        fat = kcal * 0.022;
        break;
    }

    return {
      kcal,
      carbohydrate,
      protein,
      fat,
      natrium,
      cholesterol,
      sugar,
    };
  }

  private get targetCalories() {
    const BMR = this.BMR;
    let TDEE: number;
    let targetCalories: number;

    switch (this.activityLevel) {
      case $Enums.UserActivityLevel.sedentary: // 운동 부족
        TDEE = BMR * 1.2;
        break;
      case $Enums.UserActivityLevel.lightlyActive: // 가벼운 활동
        TDEE = BMR * 1.375;
        break;
      case $Enums.UserActivityLevel.moderatelyActive: // 보통 활동
        TDEE = BMR * 1.55;
        break;
      case $Enums.UserActivityLevel.veryActive: // 많은 활동
        TDEE = BMR * 1.725;
        break;
      case $Enums.UserActivityLevel.extraActive: // 매우 높은 활동
        TDEE = BMR * 1.9;
        break;
      default:
        TDEE = BMR * 1.375;
        break;
    }

    switch (this.type) {
      case $Enums.UserType.bulk:
        targetCalories = TDEE + 300;
        break;
      case $Enums.UserType.diet:
        targetCalories = TDEE - 300;
        break;
      case $Enums.UserType.maintain:
        targetCalories = TDEE + 100;
        break;
    }

    return targetCalories;
  }

  private get BMR() {
    if (this.sex === $Enums.Sex.male) {
      return 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
    }
    return 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
  }

  constructor(user: Users) {
    Object.assign(this, user);
  }
}
