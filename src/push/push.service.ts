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
  } //fcm token을 가져오도록 변경 예정

  async sendPushNotification(fcmToken: string, timeOfDay: string) {
    let messageBody = '';
    switch (timeOfDay) {
      case 'morning':
        messageBody = '아침문구';
        break;
      case 'afternoon':
        messageBody = '점심문구';
        break;
      case 'evening':
        messageBody = '저녁문구';
        break;
    }
    const message = {
      token: fcmToken,
      notification: {
        title: '오늘의 알림(가제)',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
