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
      where: {
        id: foodId,
      },
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
      orderBy: {
        name: 'asc',
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
    '바베?��',
    '백숙',
    '바게?��',
    '반�??',
    '비프 ???르�??�?', //비프???르�??르는 ?���?, 비프�? ?���? ???르�??르도 ?��?��
    '비빔�?',
    '빙수',
    '불고�?',
    '분짜',
    '버거',
    '�?리또',
    '�??��?��',
    '칸�??�?', //?��?��?�� ?��?��
    '카프?��?��',
    '치킨',
    '칠리�?', //칠리게는 ?���? 칠리?��?��브도 ?���? 칠리�? ?��?��
    '초콜�?',
    '츄러?��',
    '?��거운 커피', //?��거운 커피?��?�� 명칭?��?��?�� -> 보통 hot??? "커피"
    '?��?��?�� 커피',
    '쿠키',
    '?��?��?��',
    '?��로�???��',
    '?��로크 무슈',
    '카레',
    '?��쿠아�?',
    '?��?��',
    '?��?��',
    '?���? 베네?��?��', //?��그베?��?��?�� ?���? ?���? �??���? ?��?��
    '?��그�??르트',
    '?��?��카르�?', //?��?��
    '?��?�� ?�� 칩스',
    '?��???',
    '?��?���? ?��?��?��',
    '?��?���? ?��?��?��',
    '갈비',
    '?��?��?��',
    '�?�?',
    '그라?��', //그라?��,그라?�� ?��?��
    '?��?���?',
    '?���?',
    '?��?���?',
    '?���?',
    '카야 ?��?��?��', //카야?��?��?��?��?��?��?�� ?���? ?��?��?���?
    '�?�?',
    '�?치찌�?',
    '?���??�� ?���??��?��', //?���??�� , ?���??��?�� ?���? 결과?��
    '?��?��?��',
    '?��?��?��',
    '마카�?',
    '마들?��',
    '마파?���?', //마파�??��?��?��?�� 존재 + 마파?���? ?��?��?��?�� ?��?�� => 마파�? �??���? ?��?��꺼같?��?��
    '�?????��',
    '머�??',
    '?��', //?��?��?�� x
    '?���?',
    '?��?��고랭',
    '?��믈렛',
    '?��?��기리', //?��?��???x ?��각�??밥도 ?��?��
    '?��????��',
    '?��?��?��', //빠에?��,?��?��?�� ?��?�� x
    '?���??��?��',
    '?��?��???',
    '?��?��',
    '?��?��',
    '?���?',
    '?��?���?', //?���? ?��?��
    '?��?��?���??��?��',
    '?��?��',
    '�??��?��?��', //?��?��
    '?���?',
    '?��?��?��?��',
    '???�??��',
    '리조?��',
    '?��?��?��',
    '?��?��?���?',
    '?��?���?',
    '?��바인?��?��', //?��?��?��?��?��
    '미역�?',
    '?��리얼',
    '?���?',
    '?��???', //?��?��?��?��?��
    '?��?��', //?��?��리모 ?���?, ?��?�� -> ?��면스?�� , ?��?���? ?��?��?��?��, ?��?��?���? ?��?��?��?��?��
    '?��?��?��?��',
    '?��?��',
    '???�?',
    '???코야?��',
    '?��?��미수',
    '?��르띠?��', //?��?��
    '?��볶이',
    '?��?��',
    '????��',
    '?��?��?��',
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
