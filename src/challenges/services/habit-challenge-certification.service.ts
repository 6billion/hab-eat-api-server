import { Injectable, NotImplementedException } from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { IChallengeCertificationService } from './challenge-certification.service.interface';

@Injectable()
export class HabitChallengeCertificationService
  implements IChallengeCertificationService<Express.Multer.File>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async certyfiyChallenge(params: {
    participant: ChallengeParticipants;
    user: User;
    data: Express.Multer.File;
  }) {
    throw new NotImplementedException();
  }
}
