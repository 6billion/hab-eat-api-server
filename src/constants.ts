import { $Enums } from '@prisma/client';

export const EventNames = {
  certifiyNutritionChallenges: 'certify.nutrition.challenges',
};

export const NutriChallengeTypes = [
  $Enums.ChallengeType.nutriBulk,
  $Enums.ChallengeType.nutriDiet,
  $Enums.ChallengeType.nutriProtein2x,
];

export enum NutriChallengeCondition {
  lte = 'lte',
  gte = 'gte',
}
