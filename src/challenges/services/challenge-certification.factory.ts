import { Injectable, NotFoundException } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { TargetNutrients } from '@type';

import { HabitChallengeCertificationService } from './habit-challenge-certification.service';
import { Protein2xChallengecertificationService } from './protein2x-challenge-certification.service';
import { IChallengeCertificationService } from './challenge-certification.service.interface';
import { DietChallengeCertificationService } from './diet-challenge-certification.service';
import { BulkChallengeCertificationService } from './bulk-challenge-certification.service';

@Injectable()
export class ChallengeCertificationServiceFactory {
  constructor(
    private readonly habitChallengeCertificationService: HabitChallengeCertificationService,
    private readonly protein2xChallengecertificationService: Protein2xChallengecertificationService,
    private readonly dietChallengeCertificationService: DietChallengeCertificationService,
    private readonly bulkChallengeCertificationService: BulkChallengeCertificationService,
  ) {}

  getChallengeCertificationService(
    type: $Enums.ChallengeType,
  ): IChallengeCertificationService<File | TargetNutrients> {
    if (type === $Enums.ChallengeType.diet) {
      return this.dietChallengeCertificationService;
    } else if (type === $Enums.ChallengeType.bulk) {
      return this.bulkChallengeCertificationService;
    } else if (type === $Enums.ChallengeType.protein2x) {
      return this.protein2xChallengecertificationService;
    } else if (type === $Enums.ChallengeType.habit) {
      return this.habitChallengeCertificationService;
    } else throw new NotFoundException();
  }
}
