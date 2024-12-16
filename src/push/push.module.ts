import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { DietPushService } from './services/diet-push.service';
import { WeekChallengeAccomplishedPushService } from './services/week-challenge-accomplished-push.service';
import { BulkChallengeSuccessPushService } from './services/bulk-chaellenge-success-push.service';
import { FirebaseAdminService } from './services/firebase-admin.service';

@Module({
  controllers: [PushController],
  providers: [
    DietPushService,
    WeekChallengeAccomplishedPushService,
    BulkChallengeSuccessPushService,
    FirebaseAdminService,
  ],
})
export class PushModule {}
