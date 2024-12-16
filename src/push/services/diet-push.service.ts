import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/db/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class DietPushService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 9 * * *')
  async PushNotificationMorning() {
    await this.dietEncouragementPush('morning');
  }

  @Cron('0 12 * * *')
  async PushNotificationAfternoon() {
    await this.dietEncouragementPush('afternoon');
  }

  @Cron('0 19 * * *')
  async PushNotificationEvening() {
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
  }

  async sendPushNotification(fcmToken: string, timeOfDay: string) {
    let messageBody = '';
    switch (timeOfDay) {
      case 'morning':
        messageBody = '아침밥 꼭 챙겨드세요!';
        break;
      case 'afternoon':
        messageBody = '바쁘다 바빠~ 점심드실 시간이에요';
        break;
      case 'evening':
        messageBody = '하루동안 고생했어요! 저녁식사는 맛있는 걸로~';
        break;
    }
    const message = {
      token: fcmToken,
      notification: {
        title: '오늘의 식단은?',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
