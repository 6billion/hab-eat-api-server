import { ChallengeParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { UtilService } from '@lib/util';
import { TargetNutrients } from '@type';
import * as _ from 'lodash';
import { PrismaService } from 'src/db/prisma.service';
import { Injectable } from '@nestjs/common';

const HOUR = 60 * 60 * 1000;
const KR_TIME_DIFF = 9 * HOUR;

export interface IChallengeCertificationService<T> {
  certyfiyChallenge: (params: {
    participant: ChallengeParticipants;
    user: User;
    data: T;
  }) => Promise<boolean>;
}

@Injectable()
export abstract class NutriChallengeCertificationService
  implements IChallengeCertificationService<TargetNutrients>
{
  constructor(
    private readonly util: UtilService,
    private readonly prisma: PrismaService,
  ) {}

  private cachedNutrientConditions: {
    [challengeId: string]: TargetNutrients;
  } = {};

  private cacheExpiryTime: number = 0;

  public async certyfiyChallenge(params: {
    participant: ChallengeParticipants;
    user: User;
    data: TargetNutrients;
  }) {
    const isSuccess = await this.validateCertifyCondition(params);
    if (isSuccess) await this.increaseSuccessCount(params.participant);
    else await this.decreaseSuccessCounts(params.participant);

    return isSuccess;
  }

  protected abstract validateCertifyCondition(input: {
    participant: ChallengeParticipants;
    user: User;
    data: TargetNutrients;
  }): Promise<boolean>;

  protected async getNutriCondition(challengeId: number) {
    const cachedNutrientCondition = this.cachedNutrientConditions[challengeId];
    if (cachedNutrientCondition) {
      return cachedNutrientCondition;
    }

    const [nutrientConditions, { endDate }] = await Promise.all([
      this.prisma.nutrientChallengeConditions
        .findFirst({ where: { challengeId } })
        .then((result) => _.omitBy(result, _.isNil))
        .then((result) =>
          _.omit(result, 'challengeId'),
        ) as Promise<TargetNutrients>,
      this.prisma.challenges.findUnique({
        where: { id: challengeId },
      }),
    ]);

    if (Date.now() > this.cacheExpiryTime) {
      this.cachedNutrientConditions = {};
      this.cacheExpiryTime = endDate.getTime() - KR_TIME_DIFF + HOUR * 24;
    }

    this.cachedNutrientConditions[challengeId] = nutrientConditions;
    return nutrientConditions as TargetNutrients;
  }

  private async increaseSuccessCount(participant: ChallengeParticipants) {
    const today = new Date(this.util.getKSTDate());
    if (
      participant.lastSuccessDate &&
      participant.lastSuccessDate.getTime() === today.getTime()
    )
      return;

    const successDays = participant.successDays + 1;
    const status = successDays >= participant.goalDays;

    await this.prisma.$transaction([
      this.prisma.challengeParticipants.update({
        where: {
          userId_challengeId: {
            userId: participant.userId,
            challengeId: participant.challengeId,
          },
        },
        data: {
          ...participant,
          lastCheckDate: today,
          lastSuccessDate: today,
          successDays,
          status,
        },
      }),
      this.prisma.challengeCertificationLogs.create({
        data: {
          userId: participant.userId,
          challengeParticipantsId: participant.id,
          date: today,
        },
      }),
    ]);
  }

  private async decreaseSuccessCounts(participant: ChallengeParticipants) {
    const today = new Date(this.util.getKSTDate());
    if (
      !participant.lastSuccessDate ||
      participant.lastSuccessDate.getTime() !== today.getTime()
    )
      return;
    const successDays = participant.successDays - 1;
    const status = successDays >= participant.goalDays;

    await this.prisma.$transaction([
      this.prisma.challengeParticipants.update({
        where: {
          userId_challengeId: {
            userId: participant.userId,
            challengeId: participant.challengeId,
          },
        },
        data: {
          ...participant,
          lastSuccessDate: null,
          lastCheckDate: today,
          successDays,
          status,
        },
      }),
      this.prisma.challengeCertificationLogs.delete({
        where: {
          userId_challengeParticipantsId_date: {
            userId: participant.userId,
            challengeParticipantsId: participant.id,
            date: today,
          },
        },
      }),
    ]);
  }
}
