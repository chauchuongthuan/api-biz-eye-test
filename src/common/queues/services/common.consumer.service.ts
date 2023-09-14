import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { HelperService } from '@src/core/services/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Customer } from '@src/schemas/customer/customer.schemas';
// import { TokenDrawService } from '@src/common/tokenDraw/services/tokenDraw.service';
import { TokenDraw } from '@src/schemas/tokenDraw/tokenDraw';
import { MailList } from '@src/schemas/marketing/mailList.schema';
import { InterestService } from '@src/common/marketingMail/services/interest.service';
import { Interest } from '@src/schemas/marketing/interest.schema';
var ObjectID = require('mongodb').ObjectID;
@Processor('common')
export class CommonConsumerService {
   constructor(
      private helperService: HelperService,
      @InjectModel(Interest.name) private interest: PaginateModel<Interest>,
      @InjectModel(TokenDraw.name) private tokenDraw: PaginateModel<TokenDraw>,
      @InjectModel(MailList.name) private mailList: PaginateModel<MailList>,
   ) {}

   @Process('importTokenDraw')
   async importTokenDraw(job: Job<unknown>): Promise<any> {
      console.log('Go import');
      const data = job.data as any;
      const newData = [];
      let count = 0;
      let i = 0;

      for (let index = 0; index < data.length; index++) {
         const row = data[index];
         console.log(index);
         count++;
         if (!newData[i]) newData[i] = [];
         newData[i].push({
            name: row?.name || null,
            nameNon: this.helperService.translateZoneNameVietnamese(row?.name),
            active: true,
            token: row.token,
            isWin: false,
            winDate: null,
         });
         if (count == 1000) {
            i++;
            count = 0;
         }
      }

      console.log('newData', newData[0].length);

      for (let index = 0; index < newData[0].length; index++) {
         const d = newData[0][index];
         console.log(index);
         console.log('d', d);
         try {
            const result = await new this.tokenDraw(d).save();
            // await this.customer.updateMany({}, [{$set: {avatar:  { "$concat": ["$noSale",".png"]}}}])
         } catch (error) {
            console.log(`LOG ERORR: ${error}`);
         }
      }

      console.log('DONE');
   }

   @Process('importMailList')
   async importMailList(job: Job<unknown>): Promise<any> {
      console.log('Go import');
      const data = job.data as any;
      const newData = [];
      let count = 0;
      let i = 0;
      const self = this;

      for (let index = 0; index < data.length; index++) {
         const row = data[index];
         console.log(index);
         count++;
         if (!newData[i]) newData[i] = [];

         const interestIds = [];

         if (row?.interest) {
            const arrInterest = await row?.interest.split(',');

            await Promise.all(
               arrInterest.map(async function (name, index) {
                  if (!name) return;
                  name = name.trim();
                  const slug = self.helperService.removeSignVietnameseSlug(name);
                  const nameNon = self.helperService.removeSignVietnamese(name);
                  const resultInterest = await self.createOnce({ name }, { name, nameNon, active: true });
                  interestIds.push(resultInterest.id);
               }),
            );
         }

         newData[i].push({
            interests: interestIds,
            email: row?.email || null,
            name: row?.name || null,
            nameNon: row?.name ? this.helperService.removeSignVietnamese(row?.name) : null,
            status: true,
         });
         if (count == 1000) {
            i++;
            count = 0;
         }
      }

      console.log('newData', newData[0].length);

      for (let index = 0; index < newData[0].length; index++) {
         const d = newData[0][index];
         console.log(index);
         console.log('d', d);
         try {
            const result = await new this.mailList(d).save();
         } catch (error) {
            console.log(`LOG ERORR: ${error}`);
         }
      }

      console.log('DONE');
   }

   async createOnce(query: Record<string, any>, data: object): Promise<Interest> {
      return await this.interest.findOneAndUpdate(
         query,
         { $setOnInsert: data },
         { upsert: true, new: true, runValidators: true },
      );
   }
}
