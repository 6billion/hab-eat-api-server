import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Cron } from '@nestjs/schedule';
import * as admin from 'firebase-admin';
import { ChallengeParticipants } from '@prisma/client';

@Injectable()
export class WeekChallengeAccomplishedPushService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 9 * * MON')
  async handleWeeklyChallengePushNotification() {
    const participants = await this.getChallengeParticipants();

    participants.forEach(async (participant) => {
      const isSuccess = this.checkChallengeSuccess(participant);
      await this.chaellengeCheckAchievement(participant, isSuccess);
    });
  }

  async getChallengeParticipants() {
    return await this.prisma.challengeParticipants.findMany({
      where: {
        status: true,
        endDate: {
          gte: new Date(),
        },
      },
    });
  }

  checkChallengeSuccess(participant: ChallengeParticipants): boolean {
    return participant.successDays >= participant.goalDays;
  }

  async chaellengeCheckAchievement(
    participant: ChallengeParticipants,
    isSuccess: boolean,
  ) {
    let messageBody = '';
    if (isSuccess) {
      messageBody = '축하합니다! 이번 주 챌린지를 성공적으로 달성하셨습니다.';
    } else {
      messageBody =
        '이번 주 챌린지 목표를 달성하지 못하셨습니다. 다음 주에 다시 도전해 보세요!';
    }

    // 사용자 FCM 토큰을 가져옵니다.
    const fcmToken = await this.getUserFcmToken(participant.userId);

    // 푸시 알림 메시지 구성
    const message = {
      token: fcmToken,
      notification: {
        title: '챌린지 결과',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }

  // 사용자 FCM 토큰을 가져오는 함수
  async getUserFcmToken(userId: number): Promise<string> {
    const token = await this.prisma.tokens.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new Error(`FCM Token을 찾을 수 없습니다: ${userId}`);
    }

    return token.token;
  }
}
