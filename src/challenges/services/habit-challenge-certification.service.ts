import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ChallengeParticipants } from '@prisma/client';
import { User } from 'src/users/user';
import { IChallengeCertificationService } from './challenge-certification.service.interface';
import { PrismaService } from 'src/db/prisma.service';
import { UtilService } from '@lib/util';
import { HttpService } from '@nestjs/axios';
import { CertifyCondition } from '@type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HabitChallengeCertificationService
  implements IChallengeCertificationService<string>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly challengeImageBaseUrl =
    this.configService.getOrThrow('S3_BASE_URL');
  private readonly aiServerBaseUrl = this.configService.getOrThrow(
    'AI_SERVER_BASER_URL',
  );

  public async certyfiyChallenge(params: {
    participant: ChallengeParticipants;
    user: User;
    data: string;
  }) {
    const today = new Date(this.util.getKSTDate());
    if (
      params.participant.lastSuccessDate &&
      params.participant.lastSuccessDate.getTime() === today.getTime()
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

    return this.increaseSuccessCount(params.participant);
  }

  private async validateCertifyCondition(
    challengeId: number,
    key: string,
  ): Promise<boolean> {
    const aiModel = await this.getDetectionServerUrl(challengeId);
    const aiServerUrl = `${this.aiServerBaseUrl}/${aiModel.path}`;
    const imageUrl = `${this.challengeImageBaseUrl}/${key}`;
    const response = await this.httpService.axiosRef.post<{
      top1ClassName: string;
    }>(aiServerUrl, { url: imageUrl });

    return response?.data?.top1ClassName === aiModel.answer;
  }

  private async getDetectionServerUrl(challengeId: number) {
    return this.prisma.challengeAiModels.findUnique({
      where: { challengeId },
    });
  }

  private async increaseSuccessCount(participant: ChallengeParticipants) {
    const today = new Date(this.util.getKSTDate());
    const successDays = participant.successDays + 1;
    const status = successDays >= participant.goalDays;

    const [result] = await this.prisma.$transaction([
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

    return result;
  }

  async getCertifyCondition(): Promise<CertifyCondition> {
    throw new BadRequestException();
  }
}
