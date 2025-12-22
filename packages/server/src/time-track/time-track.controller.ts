import { Controller, Get, Post, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { TimeTrackService } from './time-track.service';
import { CreateDailyLogDto, DailyLogFilterDto } from './dto/create-daily-log.dto';

@Controller('time-tracks')
export class TimeTrackController {
  constructor(private readonly timeTrackService: TimeTrackService) {}

  private extractToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    return authHeader.split(' ')[1];
  }

  @Post('daily')
  createDailyLog(
    @Headers('authorization') authHeader: string,
    @Body() dto: CreateDailyLogDto
  ) {
    const token = this.extractToken(authHeader);
    return this.timeTrackService.createDailyLog(token, dto);
  }

  @Get('daily')
  getDailyLogs(
    @Headers('authorization') authHeader: string,
    @Query() filter: DailyLogFilterDto
  ) {
    const token = this.extractToken(authHeader);
    return this.timeTrackService.getDailyLogs(token, filter);
  }
}
