import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '@lib/s3';
import { UtilService } from '@lib/util';

@Injectable()
export class FoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly util: UtilService,
    private readonly s3Service: S3Service,
  ) {}
  async searchDiet(foodId: number) {
    const food = await this.prisma.foods.findFirst({
      where: { id: foodId },
    });

    return food;
  }
  async autoComplete(keyword: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const result = await this.prisma.foods.findMany({
      where: {
        name: {
          search: keyword,
        },
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
      },
    });

    return result;
  }

  private readonly dietsImageBaseUrl =
    this.configService.getOrThrow('S3_BASE_URL');

  async getImageNameFromAi(key: string): Promise<string> {
    const aiServerUrl = this.configService.getOrThrow(
      'AI_SERVER_FOOD_PREDICT_URL',
    );
    const imageUrl = `${this.dietsImageBaseUrl}/${key}`;

    const response = await this.httpService.axiosRef.post<{
      top1ClassName: string;
    }>(aiServerUrl, { url: imageUrl });

    return response?.data?.top1ClassName;
  }
  getPreSignedUrls(userId: number, count = 1) {
    const today = this.util.getKSTDate();

    const result = [];
    for (let i = 0; i < count; i += 1) {
      const key = `images/diets/${userId}/${today}/meal_${i}.jpeg`;
      const url = this.s3Service.makePutImagePreSignedUrl(key);
      result.push({ url, key });
    }

    return result;
  }
}
