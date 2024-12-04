import { $Enums } from '@prisma/client';

export const EventNames = {
  certifiyNutritionChallenges: 'certify.nutrition.challenges',
};

export const NutriChallengeTypes = [
  $Enums.ChallengeType.bulk,
  $Enums.ChallengeType.diet,
  $Enums.ChallengeType.protein2x,
];

export enum NutriChallengeCondition {
  lte = 'lte',
  gte = 'gte',
}
