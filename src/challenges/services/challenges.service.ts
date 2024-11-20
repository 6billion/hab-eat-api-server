import { UtilService } from '@lib/util';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { User } from 'src/users/user';
import {
  AvaliableChallenge,
  OngoingChallenge,
} from '../dtos/get-challenges.dto';

@Injectable()
export class ChallengesService {
  constructor(
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
      this.prismaService.challengesParticipants.findMany({
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
      await this.prismaService.challengesParticipants.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
      });

    if (participant) throw new ConflictException();

    return this.prismaService.challengesParticipants.create({
      data: {
        userId,
        challengeId: id,
        challengeType: challenge.type,
        goalDays,
        successDays: 0,
        joinDate: now,
        endDate: challenge.endDate,
        status: false,
      },
    });
  }
}
