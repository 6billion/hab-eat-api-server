import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { WeekChallengeAccomplishedPushService } from './week-challenge-accomplished-push.service';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [PushController],
  providers: [PushService, WeekChallengeAccomplishedPushService],
})
export class PushModule {}
