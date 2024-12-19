import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PushService } from 'libs/push/push.service';

@Injectable()
export class TaskService {
  constructor(private readonly PushService: PushService) {}

  @Cron('0 9 * * *')
  async MorningPush() {
    await this.PushService.sendDietPushNotification('morning');
  }

  @Cron('0 12 * * *')
  async AfternoonPush() {
    await this.PushService.sendDietPushNotification('afternoon');
  }

  @Cron('0 19 * * *')
  async EveningPush() {
    await this.PushService.sendDietPushNotification('evening');
  }
  @Cron('0 9 * * MON')
  async WeeklyChallengePush() {
    await this.PushService.sendChallengePushNotification(true);
  }
}
