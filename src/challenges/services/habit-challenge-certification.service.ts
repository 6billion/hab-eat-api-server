import { Injectable, NotImplementedException } from '@nestjs/common';
import { ChallengesParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { IChallengeCertificationService } from './challenge-certification.service.interface';

@Injectable()
export class HabitChallengeCertificationService
  implements IChallengeCertificationService<File>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async certyfiyChallenge(params: {
    participant: ChallengesParticipants;
    user: User;
    data: File;
  }) {
    throw new NotImplementedException();
  }
}
