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
  labels = [
    '바베큐',
    '백숙',
    '바게트',
    '반미',
    '족발',
    '비빔밥',
    '삼겹살',
    '불고기',
    '분짜',
    '버거',
    '부리토',
    '케이크',
    '만두',
    '카프레제',
    '치킨',
    '연어',
    '초콜릿',
    '츄러스',
    '커피',
    '아이스 커피',
    '쿠키',
    '크레페',
    '크로와상',
    '크로크 무슈',
    '카레',
    '다쿠아즈',
    '딤섬',
    '도넛',
    '베이글',
    '에그 타르트',
    '라면',
    '피시 앤 칩스',
    '퐁듀',
    '프렌치 프라이',
    '프렌치 토스트',
    '갈비',
    '젤라토',
    '김밥',
    '아이스크림',
    '핫도그',
    '훠궈',
    '자장면',
    '잡채',
    '토스트',
    '케밥',
    '김치찌개',
    '된장찌개',
    '라자냐',
    '랍스터',
    '마카롱',
    '마들렌',
    '마파',
    '밀푀유',
    '머핀',
    '계란',
    '나쵸',
    '나시고랭',
    '오믈렛',
    '삼각김밥',
    '팟타이',
    '파스타',
    '팬케이크',
    '빙수',
    '파이',
    '피자',
    '팝콘',
    '요거트',
    '돈까스',
    '푸딩',
    '김치',
    '라멘',
    '라따뚜이',
    '쌀국수',
    '리조또',
    '샐러드',
    '샌드위치',
    '사시미',
    '짬뽕',
    '미역국',
    '시리얼',
    '소바',
    '와플',
    '스프',
    '스테이크',
    '스시',
    '타코',
    '타코야끼',
    '티라미수',
    '딸기',
    '떡볶이',
    '우동',
    '두부',
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
  /*async autoCompleteForAllLabels(page: number = 1, limit: number = 10) {
    const results = [];

    for (const keyword of this.labels) {
      const result = await this.autoComplete(keyword, page, limit);
      results.push({
        keyword,
        results: result,
      });
    }

    return results;
  }*/
}
