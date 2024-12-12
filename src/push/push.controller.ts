import { Controller } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly notificationService: PushService) {}
}
