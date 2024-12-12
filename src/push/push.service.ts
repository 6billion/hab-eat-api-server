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

  @Cron('0 12 * * *')
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
        messageBody = '��ħ�� �� ì�ܵ弼��!';
        break;
      case 'afternoon':
        messageBody = '�ٻڴ� �ٺ�~ ���ɵ�� �ð��̿���';
        break;
      case 'evening':
        messageBody = '�Ϸ絿�� ����߾��! ����Ļ�� ���ִ� �ɷ�~';
        break;
    }
    const message = {
      token: fcmToken,
      notification: {
        title: '������ �Ĵ���?',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
