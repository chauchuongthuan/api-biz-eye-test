import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronService } from '@src/core/services/cron.service';

@Injectable()
export class getAccessByMinuteScheduleService {
   constructor(private cronJobService: CronService) {}

   @Cron(CronExpression.EVERY_MINUTE, {
      name: 'getAccessByMinute',
   })
   async getAccessByMinute() {
      await this.cronJobService.getAccessByMinute();
   }

   @Cron(CronExpression.EVERY_MINUTE, {
      name: 'deleteAccessByMinute',
   })
   async deleteAccessByMinute() {
      await this.cronJobService.deleteAccessByMinute();
   }
}
