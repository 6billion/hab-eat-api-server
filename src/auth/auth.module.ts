import { Module } from '@nestjs/common';
import { BearerStrategy } from './strategies/bearer-strategy';

@Module({
  providers: [BearerStrategy],
})
export class AuthModule {}
