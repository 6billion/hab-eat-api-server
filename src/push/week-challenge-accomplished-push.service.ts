import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Cron } from '@nestjs/schedule';
import * as admin from 'firebase-admin';

@Injectable()
export class WeekChallengeAccomplishedPushService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 9 * * MON')
  async WeeklyChallengePushNotification() {
    const participants = await this.getChallengeParticipants();

    for (const participant of participants) {
      const isSuccess = participant.status;

      await this.sendPushNotification(participant, isSuccess);
    }
  }
  async getChallengeParticipants() {
    const lastSunday = this.getLastSunday();
    return await this.prisma.challengeParticipants.findMany({
      where: {
        status: true,
        endDate: lastSunday,
      },
    });
  }

  async sendPushNotification(participant: any, isSuccess: boolean) {
    let messageBody = '';
    if (isSuccess) {
      messageBody = '축하해요! 이번 주 챌린지를 성공적으로 달성하셨습니다!';
    } else {
      messageBody =
        '아쉬워요. 이번 주 챌린지 목표를 달성하지 못하셨습니다 (ᐡ´т ‧̫ т ᐡ)';
    }

    const fcmToken = await this.getUserFcmToken(participant.userId);

    const message = {
      token: fcmToken,
      notification: {
        title: '챌린지 결과',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }

  // FCM 토큰 가져오기(변경예정)
  async getUserFcmToken(userId: number): Promise<string> {
    const token = await this.prisma.tokens.findUnique({
      where: { userId },
    });
    return token.token;
  }
  getLastSunday(): Date {
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());
    lastSunday.setHours(23, 59, 59, 999);
    return lastSunday;
  }
}
