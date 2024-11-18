import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostUserDto } from './dtos/post-user.dto';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/db/prisma.service';
import * as crypto from 'crypto';
import { $Enums } from '@prisma/client';
import { SnsUser } from '@type';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getFacebookUser(snsToken: string) {
    const response = await this.httpService.axiosRef
      .get<{ id: string }>('https://graph.facebook.com/v7.0/me', {
        headers: { Authorization: `Bearer ${snsToken}` },
      })
      .catch(() => {
        throw new ForbiddenException();
      });

    return { type: $Enums.AccountsType.Facebook, id: response.data.id };
  }

  public async getGoolgeUser(snsToken: string) {
    const response = await this.httpService.axiosRef
      .get<{ sub: string }>('https://oauth2.googleapis.com/tokeninfo', {
        headers: { Authorization: `Bearer ${snsToken}` },
      })
      .catch(() => {
        throw new ForbiddenException();
      });

    return { type: $Enums.AccountsType.Google, id: response.data.sub };
  }

  public async signInOrUp(dto: PostUserDto, snsUser: SnsUser) {
    const existAccount = await this.prismaService.accounts.findUnique({
      where: { id_type: { id: snsUser.id, type: snsUser.type } },
    });

    if (existAccount) return this.signIn(existAccount.userId);
    return this.signUp(dto, snsUser);
  }

  public deleteUser(userId: number) {
    return this.prismaService.users.delete({ where: { id: userId } });
  }

  private async signIn(userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    const token = this.generateToken();
    await this.prismaService.tokens.upsert({
      where: { userId },
      create: { userId, token },
      update: { token },
    });

    return { user, token };
  }

  private async signUp(dto: PostUserDto, snsUser: SnsUser) {
    return this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          nickname: dto.nickname,
          hight: dto.hight,
          weight: dto.weight,
          goalKcal: dto.goalKcal,
        },
      });

      await prisma.accounts.create({
        data: {
          id: snsUser.id,
          type: snsUser.type,
          userId: user.id,
        },
      });

      const token = this.generateToken();
      await prisma.tokens.create({
        data: { userId: user.id, token },
      });

      return { user, token };
    });
  }

  private generateToken() {
    return crypto.randomBytes(48).toString('base64url');
  }
}
