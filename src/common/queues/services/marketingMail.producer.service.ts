/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MarketingMailProducerService {
   constructor(@InjectQueue('marketingMail') private marketingMailQueue: Queue) {}

   async sendMailBySchedule(data: any): Promise<any> {
      console.log('Mail Producer: ' + data);
      const job = await this.marketingMailQueue.add('sendMailBySchedule', data, {
         priority: 1,
         delay: 5000,
         attempts: 2,
         removeOnComplete: true,
      });
   }
}
