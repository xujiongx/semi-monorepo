export class CreateDailyLogDto {
  content: string;
  images?: string[];
  tags?: string[];
  date: string;
}

export class DailyLogFilterDto {
  keyword?: string;
  type?: 'day' | 'month' | 'year';
  date?: string;
}
