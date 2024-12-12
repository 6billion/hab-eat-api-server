import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/db/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 9 * * *')
  async handlePushNotificationMorning() {
    await this.dietEncouragementPush('morning');
  }

  @Cron('0 15 * * *')
  async handlePushNotificationAfternoon() {
    await this.dietEncouragementPush('afternoon');
  }

  @Cron('0 19 * * *')
  async handlePushNotificationEvening() {
    await this.dietEncouragementPush('evening');
  }

  async dietEncouragementPush(timeOfDay: string) {
    const tokens = await this.getAllTokens();
    tokens.forEach(async (token) => {
      await this.sendPushNotification(token.token, timeOfDay);
    });
  }

  async getAllTokens() {
    return await this.prisma.tokens.findMany();
  } //fcm token�� ���������� ���� ����

  async sendPushNotification(fcmToken: string, timeOfDay: string) {
    let messageBody = '';
    switch (timeOfDay) {
      case 'morning':
        messageBody = '��ħ����';
        break;
      case 'afternoon':
        messageBody = '���ɹ���';
        break;
      case 'evening':
        messageBody = '���Ṯ��';
        break;
    }
    const message = {
      token: fcmToken,
      notification: {
        title: '������ �˸�(����)',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
