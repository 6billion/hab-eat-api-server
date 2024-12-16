import { Module } from '@nestjs/common';
import { DietPushService } from '../../src/push/services/diet-push.service';
import { WeekChallengeAccomplishedPushService } from '../../src/push/services/week-challenge-accomplished-push.service';
import { BulkChallengeSuccessPushService } from '../../src/push/services/bulk-chaellenge-success-push.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { PushService } from 'libs/push/push.service';

@Module({
  providers: [
    DietPushService,
    WeekChallengeAccomplishedPushService,
    BulkChallengeSuccessPushService,
    FirebaseAdminService,
  ],
  exports: [PushService],
})
export class PushModule {}
