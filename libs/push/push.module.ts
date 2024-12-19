import { Module, Global } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { PushService } from 'libs/push/push.service';

@Global()
@Module({
  providers: [PushService, FirebaseAdminService],
  exports: [PushService, FirebaseAdminService],
})
export class PushModule {}
