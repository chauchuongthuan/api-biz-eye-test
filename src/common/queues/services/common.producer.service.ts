/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
@Injectable()
export class CommonProducerService {
   constructor(@InjectQueue('common') private commonQueue: Queue) {}

   async importTokenDraw(data: Array<Object>): Promise<any> {
      console.log('Producer: ' + data.length);
      const job = await this.commonQueue.add('importTokenDraw', data, {
         priority: 1,
         delay: 5000,
         attempts: 0,
         removeOnComplete: true,
      });
   }

   async importMailList(data: Array<Object>): Promise<any> {
      console.log('Producer: ' + data.length);
      const job = await this.commonQueue.add('importMailList', data, {
         priority: 1,
         delay: 5000,
         attempts: 2,
         removeOnComplete: true,
      });
   }
}
