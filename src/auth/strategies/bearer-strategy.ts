import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly usersService: UsersService) {
    super({ passReqToCallback: true });
  }

  async validate(req: Request, requestToken: string) {
    return this.usersService.getUserByToken(requestToken);
  }
}
