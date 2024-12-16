import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PushModule } from 'libs/push/push.module';

@Module({
  imports: [ScheduleModule.forRoot(), PushModule],
  providers: [TaskService],
})
export class TaskModule {}
