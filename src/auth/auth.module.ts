import { Module } from '@nestjs/common';
import { BearerStrategy } from './strategies/bearer-strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [BearerStrategy],
})
export class AuthModule {}
