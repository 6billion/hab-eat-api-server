import { Injectable } from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { CertifyCondition, TargetNutrients } from '@type';
import { User } from 'src/users/user';
import { NutriChallengeCertificationService } from './challenge-certification.service.interface';
import { NutriChallengeCondition } from 'src/constants';

@Injectable()
export class BulkChallengeCertificationService extends NutriChallengeCertificationService {
  protected async validateCertifyCondition({
    participant: { challengeId },
    user,
    data,
  }: {
    participant: ChallengeParticipants;
    user: User;
    data: TargetNutrients;
  }) {
    const nutrientConditions = await this.getNutriCondition(challengeId);
    const targetNutrients = user.targetNutrients;

    for (const key of Object.keys(nutrientConditions)) {
      const threshold = nutrientConditions[key] || targetNutrients[key];
      const intakeAmount = data[key];
      if (threshold > intakeAmount) return false;
    }

    return true;
  }

  async getCertifyCondition(
    challengeId: number,
    user: User,
  ): Promise<CertifyCondition> {
    const threshold = await this.getNutriCondition(challengeId);
    const target = user.targetNutrients;
    const condition = NutriChallengeCondition.gte;

    Object.keys(threshold).forEach((key) => {
      if (threshold[key] === 0) threshold[key] = target[key];
    });

    return { threshold, condition };
  }
}
