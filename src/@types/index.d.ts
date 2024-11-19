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
