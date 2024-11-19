import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostUserDto } from './dtos/post-user.dto';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/db/prisma.service';
import * as crypto from 'crypto';
import { $Enums } from '@prisma/client';
import {
  KakaoGetUserProfileApiResponse,
  NaverGetUserProfileApiResponse,
  SnsUser,
} from '@type';
import { PutUserDto } from './dtos/put-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  public async getKakaoUser(snsToken: string) {
    const response =
      await this.httpService.axiosRef.get<KakaoGetUserProfileApiResponse>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: { Authorization: `Bearer ${snsToken}` },
          validateStatus: (status) => status < 500,
        },
      );

    if (response.status !== 200 || !response?.data?.id) {
      throw new ForbiddenException();
    }

    return {
      type: $Enums.AccountType.kakao,
      id: response.data.id,
      nickname: response.data.kakao_account?.profile?.nickname,
    };
  }

  public async getNaverUser(snsToken: string) {
    const response =
      await this.httpService.axiosRef.get<NaverGetUserProfileApiResponse>(
        'https://openapi.naver.com/v1/nid/me',
        {
          headers: { Authorization: `Bearer ${snsToken}` },
          validateStatus: (status) => status < 500,
        },
      );

    if (response.status !== 200 || !response?.data?.response?.id) {
      throw new ForbiddenException();
    }

    return {
      type: $Enums.AccountType.naver,
      id: response.data.response.id,
      nickname: response.data.response.nickname,
    };
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

  public updateUser(id: number, dto: PutUserDto) {
    return this.prismaService.users.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        hight: dto.hight,
        weight: dto.weight,
        age: dto.age,
        sex: dto.sex,
        type: dto.type,
        hasDisease: dto.hasDisease,
      },
    });
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
          nickname: dto.nickname || snsUser.nickname,
          hight: dto.hight,
          weight: dto.weight,
          age: dto.age,
          sex: dto.sex,
          type: dto.type,
          hasDisease: dto.hasDisease,
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
