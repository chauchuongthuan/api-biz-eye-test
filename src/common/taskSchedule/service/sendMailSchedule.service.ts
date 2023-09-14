import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketingMailProducerService } from '@src/common/queues/services/marketingMail.producer.service';
import { CronService } from '@src/core/services/cron.service';
import { MailSchedule } from '@src/schemas/marketing/mailSchedule.schema';
import { PaginateModel } from 'mongoose';

const moment = require('moment');

@Injectable()
export class sendMailScheduleService {
   constructor(
      private cronJobService: CronService,
      private marketingQueueService: MarketingMailProducerService,
      @InjectModel(MailSchedule.name) private mailSchedule: PaginateModel<MailSchedule>,
   ) {}

   @Cron(CronExpression.EVERY_5_MINUTES, {
      name: 'autoSendMail',
   })
   async autoSendMail() {
      let now = moment(new Date());
      let schedules = await this.mailSchedule.find({ status: true, statusSent: false, sendAt: { $lte: now } });
      schedules.map(async (schedule) => {
         await this.marketingQueueService.sendMailBySchedule({ id: schedule.id });
      });
   }
}
