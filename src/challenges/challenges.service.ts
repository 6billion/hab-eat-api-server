import { UtilService } from '@lib/util';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { User } from 'src/users/user';
import {
  AvaliableChallenge,
  OngoingChallenge,
} from './dtos/get-challenges-response.dto';

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
      const participant = participants.find(({ challengeId }) => {
        challengeId === challenge.id;
      });

      if (participant) {
        ongingChallenges.push(new OngoingChallenge(challenge, participant));
      } else availableChallenges.push(new AvaliableChallenge(challenge));
    }

    return { availableChallenges, ongingChallenges };
  }
}
