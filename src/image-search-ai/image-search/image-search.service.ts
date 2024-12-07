import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageSearchAiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  private async getDetectionServerUrl(foodId: number) {
    return this.prisma.foodAiModels.findUnique({
      where: { foodId },
    });
  }

  private readonly dietsImageBaseUrl =
    this.configService.getOrThrow('S3_BASE_URL');
  private readonly aiServerBaseUrl =
    this.configService.getOrThrow('AI_SERVER_BASE_URL');

  async getImageNameFromAi(foodId: number, key: string): Promise<string> {
    const aiModel = await this.getDetectionServerUrl(foodId);
    const aiServerUrl = `${this.aiServerBaseUrl}/${aiModel.path}`;
    const imageUrl = `${this.dietsImageBaseUrl}/${key}`;

    const response = await this.httpService.axiosRef.post<{
      top1ClassName: string;
    }>(aiServerUrl, { url: imageUrl });

    return response?.data?.top1ClassName;
  }
}
