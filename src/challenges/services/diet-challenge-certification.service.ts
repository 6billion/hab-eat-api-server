import { Injectable } from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { TargetNutrients } from '@type';
import { User } from 'src/users/user';
import { NutriChallengeCertificationService } from './challenge-certification.service.interface';

@Injectable()
export class DietChallengeCertificationService extends NutriChallengeCertificationService {
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
      if (threshold <= intakeAmount) return false;
    }
    return true;
  }
}
