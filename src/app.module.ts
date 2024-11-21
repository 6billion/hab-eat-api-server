import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DietModule } from './diet/diet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    { ...HttpModule.register({}), global: true },
    DbModule,
    UsersModule,
    AuthModule,
    DietModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
