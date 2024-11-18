import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-http-bearer';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private prismaService: PrismaService) {
    super({ passReqToCallback: true });
  }

  async validate(req: Request, requestToken: string) {
    const token = await this.prismaService.tokens.findUnique({
      where: { token: requestToken },
    });
    if (!token) throw new UnauthorizedException();
    return this.prismaService.users.findUniqueOrThrow({
      where: { id: token.userId },
    });
  }
}
