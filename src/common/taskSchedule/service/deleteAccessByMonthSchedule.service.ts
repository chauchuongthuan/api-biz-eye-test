import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronService } from '@src/core/services/cron.service';

@Injectable()
export class deleteAccessByMonthScheduleService {
   constructor(private cronJobService: CronService) {}

   @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
      name: 'deleteAccessByMonth',
   })
   async deleteAccessByMonth() {
      await this.cronJobService.deleteAccessByMonth();
   }
}
