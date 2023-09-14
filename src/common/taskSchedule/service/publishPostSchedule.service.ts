import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronService } from '@src/core/services/cron.service';

@Injectable()
export class publishPostScheduleService {
   constructor(private cronJobService: CronService) {}

   @Cron(CronExpression.EVERY_DAY_AT_1AM, {
      name: 'autoPublishPost',
   })
   async autoPublishPost() {
      await this.cronJobService.autoPublishPost();
   }
}
