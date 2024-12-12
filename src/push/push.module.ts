import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { DietPushService } from './services/diet-push.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { WeekChallengeAccomplishedPushService } from './services/week-challenge-accomplished-push.service';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [PushController],
  providers: [DietPushService, WeekChallengeAccomplishedPushService],
})
export class PushModule {}
