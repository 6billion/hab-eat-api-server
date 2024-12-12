import { Controller } from '@nestjs/common';
import { DietPushService } from './services/diet-push.service';

@Controller('push')
export class PushController {
  constructor(private readonly notificationService: DietPushService) {}
}
