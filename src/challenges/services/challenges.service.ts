import { UtilService } from '@lib/util';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { User } from 'src/users/user';
import {
  AvaliableChallenge,
  OngoingChallenge,
} from '../dtos/get-challenges.dto';
import { ChallengeCertificationServiceFactory } from './challenge-certification.factory';
import { ChallengeParticipants } from '@prisma/client';
import { TargetNutrients } from '@type';
import { NutriChallengeTypes } from 'src/constants';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '@lib/s3';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly certificationServiceFactory: ChallengeCertificationServiceFactory,
    private readonly prismaService: PrismaService,
    private readonly util: UtilService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  public async getChallenges(user: User) {
    const monday = new Date(this.util.getThisWeekMondayKST());

    const [challenges, participants] = await Promise.all([
      this.prismaService.challenges.findMany({
        where: { targetUserType: user.type },
      }),
      this.prismaService.challengeParticipants.findMany({
        where: {
          userId: user.id,
          startDate: monday,
        },
      }),
    ]);

    const availableChallenges = [];
    const ongingChallenges = [];

    for (const challenge of challenges) {
      const participant = participants.find(
        ({ challengeId }) => challengeId === challenge.id,
      );

      if (participant) {
        ongingChallenges.push(new OngoingChallenge(challenge, participant));
      } else availableChallenges.push(new AvaliableChallenge(challenge));
    }

    return { availableChallenges, ongingChallenges };
  }

  public async createChallengeParticipants({
    id,
    userId,
    goalDays,
  }: {
    id: number;
    userId: number;
    goalDays: number;
  }) {
    const today = new Date(this.util.getKSTDate());
    const monday = new Date(this.util.getThisWeekMondayKST());
    const sunday = new Date(this.util.getThisWeekSundayKST());

    if (
      this.configService.getOrThrow('NODE_ENV') === 'production' &&
      today.getTime() !== monday.getTime()
    ) {
      throw new BadRequestException();
    }

    const challenge = await this.prismaService.challenges.findUniqueOrThrow({
      where: { id },
    });

    const participant =
      await this.prismaService.challengeParticipants.findUnique({
        where: {
          userId_startDate_challengeId: {
            userId,
            challengeId: id,
            startDate: monday,
          },
        },
      });

    if (participant) throw new ConflictException();

    return this.prismaService.challengeParticipants.create({
      data: {
        userId,
        challengeId: id,
        challengeType: challenge.type,
        goalDays,
        successDays: 0,
        startDate: monday,
        endDate: sunday,
        status: false,
      },
    });
  }

  async findNutritionChallengeParticipants(userId: number) {
    const monday = new Date(this.util.getThisWeekMondayKST());
    return this.prismaService.challengeParticipants.findMany({
      where: {
        userId,
        startDate: monday,
        challengeType: { in: NutriChallengeTypes },
      },
    });
  }

  findUniqueParticipantOrThrow(userId: number, challengeId: number) {
    const startDate = new Date(this.util.getThisWeekMondayKST());
    return this.prismaService.challengeParticipants.findUniqueOrThrow({
      where: {
        userId_startDate_challengeId: { userId, challengeId, startDate },
      },
    });
  }

  async certyfyChallenge({
    participant,
    user,
    data,
  }: {
    participant: ChallengeParticipants;
    user: User;
    data: string | TargetNutrients;
  }) {
    const certificationService =
      this.certificationServiceFactory.getChallengeCertificationService(
        participant.challengeType,
      );

    return certificationService.certyfiyChallenge({
      participant,
      user,
      data,
    });
  }

  async certifyManyNutritionChallenges({
    user,
    participants,
    data,
  }: {
    user: User;
    participants: ChallengeParticipants[];
    data: TargetNutrients;
  }) {
    const promises = participants.map((participant) => {
      const certificationService =
        this.certificationServiceFactory.getChallengeCertificationService(
          participant.challengeType,
        );

      return certificationService.certyfiyChallenge({
        participant,
        user,
        data,
      });
    });

    return Promise.all(promises);
  }

  async getChallengeCertificationLogs({
    challengeId,
    userId,
    startDate,
    endDate,
  }: {
    challengeId: number;
    userId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prismaService.challengeParticipants.findMany({
      where: {
        challengeId,
        userId,
        endDate: { gte: startDate, lte: endDate },
      },
      include: { challengeCertificationLogs: true },
    });
  }

  async getChallengeConditions(challengeId: number, user: User) {
    const challenge = await this.prismaService.challenges.findUnique({
      where: { id: challengeId },
    });
    const certificationService =
      this.certificationServiceFactory.getChallengeCertificationService(
        challenge.type,
      );
    return certificationService.getCertifyCondition(challengeId, user);
  }

  getPreSignedUrls(userId: number, count = 1) {
    const today = this.util.getKSTDate();
    const ts = Date.now();

    const result = [];
    for (let i = 0; i < count; i += 1) {
      const key = `challenges/${today}/${userId}/${ts}_${i}`;
      const url = this.s3Service.makePutImagePreSignedUrl(key);
      result.push({ url, key });
    }

    return result;
  }
}
