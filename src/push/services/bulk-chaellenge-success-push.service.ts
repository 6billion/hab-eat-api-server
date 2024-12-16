import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import * as admin from 'firebase-admin';
import { ChallengeParticipants } from '@prisma/client';

@Injectable()
export class BulkChallengeSuccessPushService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkChallengeSuccess(participant: ChallengeParticipants) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      participant.challengeType !== 'nutriBulk' ||
      !participant.lastSuccessDate ||
      new Date(participant.lastSuccessDate).getTime() !== today.getTime()
    ) {
      return;
    }

    const fcmToken = await this.getUserFcmToken(participant.userId);
    if (fcmToken) {
      await this.sendFcm(
        fcmToken,
        '벌크업 성공',
        '오늘 nutriBulk 챌린지를 성공하셨습니다!',
      );
    }
  }

  async getUserFcmToken(userId: number): Promise<string> {
    const token = await this.prisma.tokens.findUnique({
      where: { userId },
    });
    return token.token;
  }

  async sendFcm(token: string, title: string, message: string) {
    const payload = {
      token: token,
      notification: {
        title: title,
        body: message,
      },
    };
    await admin.messaging().send(payload);
  }
}
