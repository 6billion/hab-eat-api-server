import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  async sendDietPushNotification(timeOfDay: string) {
    const messageBody = this.getMessageBody(timeOfDay);
    const message = {
      topic: 'diet',
      notification: {
        title: '오늘의 식단은?',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }

  private getMessageBody(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return '아침밥 꼭 챙겨드세요!';
      case 'afternoon':
        return '바쁘다 바빠~ 점심드실 시간이에요';
      case 'evening':
        return '하루동안 고생했어요! 저녁식사는 맛있는 걸로~';
      default:
        return '';
    }
  }
  async sendChallengePushNotification(isSuccess: boolean) {
    const messageBody = isSuccess
      ? '축하해요! 이번 주 챌린지를 성공적으로 달성하셨습니다!'
      : '아쉬워요. 이번 주 챌린지 목표를 달성하지 못하셨습니다 (?´т ?? т ?)';

    const message = {
      topic: 'weekly-challenge',
      notification: {
        title: '챌린지 결과',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
