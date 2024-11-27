import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { IChallengeCertificationService } from './challenge-certification.service.interface';
import { PrismaService } from 'src/db/prisma.service';
import { UtilService } from '@lib/util';
import { HttpService } from '@nestjs/axios';
import { CertifyCondition } from '@type';

@Injectable()
export class HabitChallengeCertificationService
  implements IChallengeCertificationService<Express.Multer.File>
{
  @Inject() prisma: PrismaService;
  @Inject() util: UtilService;
  @Inject() httpService: HttpService;

  public async certyfiyChallenge(params: {
    participant: ChallengeParticipants;
    user: User;
    data: Express.Multer.File;
  }) {
    const today = new Date(this.util.getKSTDate());
    if (
      params.participant.lastSuccessDate &&
      params.participant.lastCheckDate.getTime() === today.getTime()
    ) {
      throw new ConflictException();
    }

    const success = await this.validateCertifyCondition(
      params.participant.challengeId,
      params.data,
    );
    if (!success) {
      throw new BadRequestException();
    }

    await this.increaseSuccessCount(params.participant);
    return true;
  }

  private async validateCertifyCondition(
    challengeId: number,
    data: Express.Multer.File,
  ): Promise<boolean> {
    const url = await this.getDetectionServerUrl(challengeId);
    const blob = new Blob([data.buffer], { type: data.mimetype });
    const file = new File([blob], data.originalname, { type: data.mimetype });

    const formData = new FormData();
    formData.append('file', file);

    const response = await this.httpService.axiosRef.post<boolean>(
      url,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    return response?.data === true;
  }

  private async getDetectionServerUrl(challengeId: number) {
    const result =
      await this.prisma.challengeImageDetectionServerUrls.findUnique({
        where: { challengeId },
      });

    return result.url;
  }

  private async increaseSuccessCount(participant: ChallengeParticipants) {
    const today = new Date(this.util.getKSTDate());
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

  async getCertifyCondition(): Promise<CertifyCondition> {
    throw new BadRequestException();
  }
}
