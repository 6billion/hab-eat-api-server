import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChallengesModule } from './challenges/challenges.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UtilModule } from '@lib/util';
import { S3Module } from '@lib/s3';
import { DietsModule } from './diets/diets.module';
import { FoodsModule } from './foods/foods.module';
import { PushModule } from '../libs/push/push.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    { ...HttpModule.register({}), global: true },
    EventEmitterModule.forRoot(),
    UtilModule,
    S3Module,
    DbModule,
    UsersModule,
    AuthModule,
    ChallengesModule,
    DietsModule,
    FoodsModule,
    PushModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
