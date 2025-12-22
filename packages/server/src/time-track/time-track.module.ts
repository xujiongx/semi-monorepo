import { Module } from '@nestjs/common';
import { TimeTrackController } from './time-track.controller';
import { TimeTrackService } from './time-track.service';

@Module({
  controllers: [TimeTrackController],
  providers: [TimeTrackService],
})
export class TimeTrackModule {}
