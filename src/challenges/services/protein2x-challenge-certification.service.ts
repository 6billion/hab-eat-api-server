import { Injectable } from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { CertifyCondition, TargetNutrients } from '@type';
import { User } from 'src/users/user';
import {
  IChallengeCertificationService,
  NutriChallengeCertificationService,
} from './challenge-certification.service.interface';
import { NutriChallengeCondition } from 'src/constants';

@Injectable()
export class Protein2xChallengecertificationService
  extends NutriChallengeCertificationService
  implements IChallengeCertificationService<TargetNutrients>
{
  protected async validateCertifyCondition({
    user,
    data,
  }: {
    participant: ChallengeParticipants;
    user: User;
    data: TargetNutrients;
  }) {
    const threshold = user.weight * 2;
    const intakeAmount = data.protein;

    if (threshold <= intakeAmount) return true;
    return false;
  }

  async getCertifyCondition(
    challengeId: number,
    user: User,
  ): Promise<CertifyCondition> {
    const threshold = { protein: user.weight * 2 };
    const condition = NutriChallengeCondition.gte;
    return { threshold, condition };
  }
}
