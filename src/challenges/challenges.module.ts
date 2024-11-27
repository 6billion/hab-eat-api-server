import { Module } from '@nestjs/common';
import {
  BulkChallengeCertificationService,
  ChallengeCertificationServiceFactory,
  ChallengesService,
  DietChallengeCertificationService,
  HabitChallengeCertificationService,
  Protein2xChallengecertificationService,
} from './services';
import { ChallengesController } from './challenges.controller';

@Module({
  providers: [
    ChallengesService,
    ChallengeCertificationServiceFactory,
    DietChallengeCertificationService,
    BulkChallengeCertificationService,
    HabitChallengeCertificationService,
    Protein2xChallengecertificationService,
  ],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
