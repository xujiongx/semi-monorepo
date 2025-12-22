import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDailyLogDto, DailyLogFilterDto } from './dto/create-daily-log.dto';

@Injectable()
export class TimeTrackService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getUser(token: string) {
    const { data: { user }, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async createDailyLog(token: string, dto: CreateDailyLogDto) {
    const user = await this.getUser(token);
    
    const { data, error } = await this.supabaseService
      .getClient()
      .from('daily_logs')
      .insert({
        user_id: user.id,
        content: dto.content,
        images: dto.images || [],
        tags: dto.tags || [],
        date: dto.date, // Assuming ISO string or date string
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async getDailyLogs(token: string, filter: DailyLogFilterDto) {
    const user = await this.getUser(token);
    
    let query = this.supabaseService
      .getClient()
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (filter.keyword) {
      query = query.ilike('content', `%${filter.keyword}%`);
    }

    if (filter.date && filter.type) {
      const date = new Date(filter.date);
      // Ensure valid date
      if (!isNaN(date.getTime())) {
        if (filter.type === 'day') {
            // For 'day', we want to match the specific date. 
            // If the DB stores 'YYYY-MM-DD', we might need to be careful with timezones if we send full ISO.
            // But assuming 'date' column is timestamp, we use range.
            const startOfDay = new Date(date);
            startOfDay.setHours(0,0,0,0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23,59,59,999);
            
            query = query.gte('date', startOfDay.toISOString()).lte('date', endOfDay.toISOString());
        } else if (filter.type === 'month') {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
            query = query.gte('date', startOfMonth.toISOString()).lte('date', endOfMonth.toISOString());
        } else if (filter.type === 'year') {
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
            query = query.gte('date', startOfYear.toISOString()).lte('date', endOfYear.toISOString());
        }
      }
    }

    const { data, error } = await query;
    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
