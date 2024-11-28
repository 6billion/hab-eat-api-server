import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class UtilService {
  constructor() {}

  private readonly KST_TIMEZONE = 'Asia/Seoul';

  getKSTDate(): string {
    return dayjs().tz(this.KST_TIMEZONE).format('YYYY-MM-DD');
  }

  getDateAfter7DaysKST(): string {
    return dayjs().tz(this.KST_TIMEZONE).add(7, 'day').format('YYYY-MM-DD');
  }

  getThisWeekMondayKST(): string {
    const today = dayjs().tz(this.KST_TIMEZONE);
    const monday = today.startOf('week').add(1, 'day');
    return monday.format('YYYY-MM-DD');
  }

  getThisWeekSundayKST(): string {
    const today = dayjs().tz(this.KST_TIMEZONE);
    const monday = today.startOf('week').add(7, 'day');
    return monday.format('YYYY-MM-DD');
  }
}
