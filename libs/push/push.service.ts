import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  async sendDietPushNotification(timeOfDay: string) {
    const messageBody = this.getMessageBody(timeOfDay);
    const message = {
      topic: 'diet',
      notification: {
        title: '������ �Ĵ���?',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }

  private getMessageBody(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return '��ħ�� �� ì�ܵ弼��!';
      case 'afternoon':
        return '�ٻڴ� �ٺ�~ ���ɵ�� �ð��̿���';
      case 'evening':
        return '�Ϸ絿�� ����߾��! ����Ļ�� ���ִ� �ɷ�~';
      default:
        return '';
    }
  }
  async sendChallengePushNotification(isSuccess: boolean) {
    const messageBody = isSuccess
      ? '�����ؿ�! �̹� �� ç������ ���������� �޼��ϼ̽��ϴ�!'
      : '�ƽ�����. �̹� �� ç���� ��ǥ�� �޼����� ���ϼ̽��ϴ� (?���� ?? �� ?)';

    const message = {
      topic: 'weekly-challenge',
      notification: {
        title: 'ç���� ���',
        body: messageBody,
      },
    };
    await admin.messaging().send(message);
  }
}
