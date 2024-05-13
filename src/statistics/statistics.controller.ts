import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Auth()
  getMain(@CurrentUser('id') userId: number) {
    return this.statisticsService.getMain(userId);
  }
}
