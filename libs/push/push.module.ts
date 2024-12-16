import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { PushService } from 'libs/push/push.service';

@Module({
  providers: [PushService, FirebaseAdminService],
  exports: [PushService],
})
export class PushModule {}
