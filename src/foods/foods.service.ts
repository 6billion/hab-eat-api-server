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
  private readonly labels = [
    '바베큐',
    '백숙',
    '바게트',
    '반미',
    '비프 타르타르',
    '비빔밥',
    '빙수',
    '불고기',
    '분짜',
    '버거',
    '부리토',
    '케이크',
    '카놀리',
    '카프레제',
    '치킨',
    '칠리게',
    '초콜릿',
    '추로스',
    '뜨거운 커피',
    '아이스 커피',
    '쿠키',
    '크레페',
    '크로와상',
    '크로크 무슈',
    '카레',
    '다쿠아즈',
    '딤섬',
    '도넛',
    '에그 베네딕트',
    '에그 타르트',
    '에스카르고',
    '피시 앤 칩스',
    '퐁듀',
    '프렌치 프라이',
    '프렌치 토스트',
    '갈비',
    '젤라토',
    '김밥',
    '그라탱',
    '핫도그',
    '훠궈',
    '자장면',
    '잡채',
    '카야 토스트',
    '케밥',
    '김치찌개',
    '한국식 팬케이크',
    '라자냐',
    '랍스터',
    '마카롱',
    '마들렌',
    '마파두부',
    '밀푀유',
    '머핀',
    '난',
    '나쵸',
    '나시고랭',
    '오믈렛',
    '오니기리',
    '팟타이',
    '파에야',
    '팬케이크',
    '파스타',
    '파이',
    '피자',
    '팝콘',
    '포크찹',
    '파운드케이크',
    '푸딩',
    '케사디야',
    '라멘',
    '라따뚜이',
    '쌀국수',
    '리조또',
    '샐러드',
    '샌드위치',
    '사시미',
    '슈바인학세',
    '미역국',
    '시리얼',
    '소바',
    '쏨땀',
    '수프',
    '스테이크',
    '스시',
    '타코',
    '타코야끼',
    '티라미수',
    '또르띠야',
    '떡볶이',
    '우동',
    '와플',
    '월남쌈',
  ];
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

    return this.labels.includes(response?.data?.top1ClassName)
      ? response.data.top1ClassName
      : 'Unknown';
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
