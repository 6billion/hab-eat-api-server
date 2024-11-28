import { NutriChallengeCondition } from 'src/constants';

export type SnsUser = {
  type: $Enums.AccountType;
  id: string;
  nickname?: string;
};

export type KakaoGetUserProfileApiResponse = {
  id: string;
  kakao_account: { profile: { nickname: string } };
};

export type NaverGetUserProfileApiResponse = {
  response: { id: string; nickname: string };
};

export type TargetNutrients = {
  kcal: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  natrium: number;
  cholesterol: number;
  sugar: number;
};

export type CertifyCondition = {
  threshold: Partial<TargetNutrients>;
  condition: NutriChallengeCondition;
};
