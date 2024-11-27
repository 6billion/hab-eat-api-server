import { ChallengeParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { UtilService } from '@lib/util';
import { CertifyCondition, TargetNutrients } from '@type';
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

  getCertifyCondition: (
    challengeId: number,
    user: User,
  ) => Promise<CertifyCondition>;
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
    [challengeId: string]: Partial<TargetNutrients>;
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

  public abstract getCertifyCondition(
    challengeId: number,
    user: User,
  ): Promise<CertifyCondition>;

  protected async getNutriCondition(challengeId: number) {
    const cachedNutrientCondition = this.cachedNutrientConditions[challengeId];
    if (cachedNutrientCondition) {
      return cachedNutrientCondition;
    }

    const nutrientConditions = await this.prisma.nutrientChallengeConditions
      .findFirst({ where: { challengeId } })
      .then((result) => _.omitBy(result, _.isNil))
      .then((result) => _.omit(result, 'challengeId'));

    if (Date.now() > this.cacheExpiryTime) {
      const sunday = new Date(this.util.getThisWeekSundayKST());
      this.cachedNutrientConditions = {};
      this.cacheExpiryTime = sunday.getTime() - KR_TIME_DIFF + HOUR * 24;
    }

    this.cachedNutrientConditions[challengeId] = nutrientConditions;
    return nutrientConditions;
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
        where: { id: participant.id },
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
        where: { id: participant.id },
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
