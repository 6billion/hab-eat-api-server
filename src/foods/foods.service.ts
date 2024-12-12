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
    'ë°”ë² ?',
    'ë°±ìˆ™',
    'ë°”ê²Œ?Š¸',
    'ë°˜ë??',
    'ë¹„í”„ ???ë¥´í??ë¥?', //ë¹„í”„???ë¥´í??ë¥´ëŠ” ?—†ê³?, ë¹„í”„ë§? ?ˆê³? ???ë¥´í??ë¥´ë„ ?—†?Œ
    'ë¹„ë¹”ë°?',
    'ë¹™ìˆ˜',
    'ë¶ˆê³ ê¸?',
    'ë¶„ì§œ',
    'ë²„ê±°',
    'ë¶?ë¦¬ë˜',
    'ì¼??´?¬',
    'ì¹¸ë??ë¡?', //?°?´?„° ?—†?Œ
    'ì¹´í”„? ˆ? œ',
    'ì¹˜í‚¨',
    'ì¹ ë¦¬ê²?', //ì¹ ë¦¬ê²ŒëŠ” ?—†ê³? ì¹ ë¦¬?¬? ˆë¸Œë„ ?—†ê³? ì¹ ë¦¬ë§? ?‚˜?˜´
    'ì´ˆì½œë¦?',
    'ì¸„ëŸ¬?Š¤',
    '?œ¨ê±°ìš´ ì»¤í”¼', //?œ¨ê±°ìš´ ì»¤í”¼?¼?Š” ëª…ì¹­?´?—†?Œ -> ë³´í†µ hot??? "ì»¤í”¼"
    '?•„?´?Š¤ ì»¤í”¼',
    'ì¿ í‚¤',
    '?¬? ˆ?˜',
    '?¬ë¡œì???ƒ',
    '?¬ë¡œí¬ ë¬´ìŠˆ',
    'ì¹´ë ˆ',
    '?‹¤ì¿ ì•„ì¦?',
    '?”¤?„¬',
    '?„?„›',
    '?—ê·? ë² ë„¤?”•?Š¸', //?—ê·¸ë² ?„¤?”•?Š¸ ?—†ê³? ?—ê·? ê´?? ¨ë§? ?‚˜?˜´
    '?—ê·¸í??ë¥´íŠ¸',
    '?—?Š¤ì¹´ë¥´ê³?', //?—†?Œ
    '?”¼?‹œ ?•¤ ì¹©ìŠ¤',
    '????',
    '?”„? Œì¹? ?”„?¼?´',
    '?”„? Œì¹? ?† ?Š¤?Š¸',
    'ê°ˆë¹„',
    '? ¤?¼?˜',
    'ê¹?ë°?',
    'ê·¸ë¼?ƒ±', //ê·¸ë¼?ƒ±,ê·¸ë¼?ƒ• ?—†?Œ
    '?•«?„ê·?',
    '?› ê¶?',
    '??¥ë©?',
    '?¡ì±?',
    'ì¹´ì•¼ ?† ?Š¤?Š¸', //ì¹´ì•¼?† ?Š¤?Š¸?°?´?„°?Š” ?—†ê³? ?† ?Š¤?Š¸ë§?
    'ì¼?ë°?',
    'ê¹?ì¹˜ì°Œê°?',
    '?•œêµ??‹ ?Œ¬ì¼??´?¬', //?•œêµ??‹ , ?Œ¬ì¼??´?Š¸ ?”°ë¡? ê²°ê³¼?œ¸
    '?¼??ƒ',
    '??Š¤?„°',
    'ë§ˆì¹´ë¡?',
    'ë§ˆë“¤? Œ',
    'ë§ˆíŒŒ?‘ë¶?', //ë§ˆíŒŒê´?? ¨?Œ?‹?´ ì¡´ì¬ + ë§ˆíŒŒ?‘ë¶? ?°?´?„°?„ ?ˆ?Œ => ë§ˆíŒŒë¡? ê°??Š”ê²? ?‚˜?„êº¼ê°™?•„?š”
    'ë°?????œ ',
    'ë¨¸í??',
    '?‚œ', //?°?´?„° x
    '?‚˜ìµ?',
    '?‚˜?‹œê³ ë­',
    '?˜¤ë¯ˆë ›',
    '?˜¤?‹ˆê¸°ë¦¬', //?°?´???x ?‚¼ê°ê??ë°¥ë„ ?—†?Œ
    '?ŒŸ????´',
    '?ŒŒ?—?•¼', //ë¹ ì—?•¼,?ŒŒ?—?•„ ?‘˜?‹¤ x
    '?Œ¬ì¼??´?¬',
    '?ŒŒ?Š¤???',
    '?ŒŒ?´',
    '?”¼?',
    '?Œì½?',
    '?¬?¬ì°?', //?­ì°? ?—†?Œ
    '?ŒŒ?š´?“œì¼??´?¬',
    '?‘¸?”©',
    'ì¼??‚¬?””?•¼', //?—†?Œ
    '?¼ë©?',
    '?¼?”°?šœ?´',
    '???êµ??ˆ˜',
    'ë¦¬ì¡°?˜',
    '?ƒ?Ÿ¬?“œ',
    '?ƒŒ?“œ?œ„ì¹?',
    '?‚¬?‹œë¯?',
    '?Šˆë°”ì¸?•™?„¸', //?°?´?„°?—†?Œ
    'ë¯¸ì—­êµ?',
    '?‹œë¦¬ì–¼',
    '?†Œë°?',
    '?¨???', //?°?´?„°?—†?Œ
    '?ˆ˜?”„', //?ˆ˜?”„ë¦¬ëª¨ ?ˆê³?, ?Š¤?”„ -> ?¼ë©´ìŠ¤?”„ , ?•„?‹ˆë©? ?Š¤?”„? ˆ?´, ?—?Š¤?”„ë¦? ?°?´?„°?ˆ?Œ
    '?Š¤?…Œ?´?¬',
    '?Š¤?‹œ',
    '???ì½?',
    '???ì½”ì•¼?¼',
    '?‹°?¼ë¯¸ìˆ˜',
    '?˜ë¥´ë ?•¼', //?—†?Œ
    '?–¡ë³¶ì´',
    '?š°?™',
    '????”Œ',
    '?›”?‚¨?Œˆ',
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
