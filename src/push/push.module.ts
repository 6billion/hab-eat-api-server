import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [PushController],
  providers: [PushService],
})
export class PushModule {}
