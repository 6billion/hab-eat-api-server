import { UtilService } from '@lib/util';
import { ConflictException, Injectable } from '@nestjs/common';
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

@Injectable()
export class ChallengesService {
  constructor(
    private readonly certificationServiceFactory: ChallengeCertificationServiceFactory,
    private readonly prismaService: PrismaService,
    private readonly util: UtilService,
  ) {}

  public async getChallenges(user: User) {
    const now = new Date(this.util.getKSTDate());

    const [challenges, participants] = await Promise.all([
      this.prismaService.challenges.findMany({
        where: {
          startDate: { lte: now },
          endDate: { gte: now },
          targetUserType: user.type,
        },
      }),
      this.prismaService.challengeParticipants.findMany({
        where: {
          userId: user.id,
          endDate: { gte: now },
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
    const now = new Date(this.util.getKSTDate());

    const challenge = await this.prismaService.challenges.findUniqueOrThrow({
      where: { id, startDate: { lte: now }, endDate: { gte: now } },
    });

    const participant =
      await this.prismaService.challengeParticipants.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
      });

    if (participant) throw new ConflictException();

    return this.prismaService.challengeParticipants.create({
      data: {
        userId,
        challengeId: id,
        challengeType: challenge.type,
        goalDays,
        successDays: 0,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        status: false,
      },
    });
  }

  async findNutritionChallengeParticipants(userId: number) {
    const today = new Date(this.util.getKSTDate());
    return this.prismaService.challengeParticipants.findMany({
      where: {
        userId,
        endDate: { gte: today },
        challengeType: { in: NutriChallengeTypes },
      },
    });
  }

  findUniqueParticipantOrThrow(userId: number, challengeId: number) {
    const today = new Date(this.util.getKSTDate());

    return this.prismaService.challengeParticipants.findUniqueOrThrow({
      where: {
        userId_challengeId: { userId, challengeId },
        startDate: { lte: today },
        endDate: { gte: today },
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
    data: Express.Multer.File | TargetNutrients;
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

    return Promise.allSettled(promises);
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
}
