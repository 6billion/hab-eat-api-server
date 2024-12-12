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
      messageBody = '�����մϴ�! �̹� �� ç������ ���������� �޼��ϼ̽��ϴ�.';
    } else {
      messageBody =
        '�̹� �� ç���� ��ǥ�� �޼����� ���ϼ̽��ϴ�. ���� �ֿ� �ٽ� ������ ������!';
    }

    // ����� FCM ��ū�� �����ɴϴ�.
    const fcmToken = await this.getUserFcmToken(participant.userId);

    // Ǫ�� �˸� �޽��� ����
    const message = {
      token: fcmToken,
      notification: {
        title: 'ç���� ���',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }

  // ����� FCM ��ū�� �������� �Լ�
  async getUserFcmToken(userId: number): Promise<string> {
    const token = await this.prisma.tokens.findUnique({
      where: { userId },
    });

    if (!token) {
      throw new Error(`FCM Token�� ã�� �� �����ϴ�: ${userId}`);
    }

    return token.token;
  }
}
