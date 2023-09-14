import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { HelperService } from '@src/core/services/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MailList } from '@src/schemas/marketing/mailList.schema';
import { Interest } from '@src/schemas/marketing/interest.schema';
import { MailSchedule } from '@src/schemas/marketing/mailSchedule.schema';
import { EmailService } from '@src/common/email/email.service';

const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');

@Processor('marketingMail')
export class MarketingMailConsumerService {
   constructor(
      private helperService: HelperService,
      private readonly emailService: EmailService,
      @InjectModel(Interest.name) private interest: PaginateModel<Interest>,
      @InjectModel(MailList.name) private mailList: PaginateModel<MailList>,
      @InjectModel(MailSchedule.name) private mailSchedule: PaginateModel<MailSchedule>,
   ) {}

   @Process('sendMailBySchedule')
   async sendMailBySchedule(job: Job<unknown>): Promise<any> {
      console.log('Go Send Mail');
      const data = job.data as any;
      const self = this;

      const emails = [];

      if (data?.id) {
         const schedule = await this.mailSchedule.findById(data?.id).populate('interests').populate('assigned');

         console.log(schedule);

         if (schedule) {
            await this.mailSchedule.findByIdAndUpdate(schedule.id, { statusSent: true }, { new: true });

            if (schedule.assigned.length) {
               for (let index = 0; index < schedule.assigned.length; index++) {
                  const element = schedule.assigned[index];

                  const mailList = await self.mailList.findById(element.id);

                  if (mailList.status) {
                     emails.push(mailList.email);
                  }
               }
            }

            if (schedule.interests.length) {
               for (let index = 0; index < schedule.interests.length; index++) {
                  const element = schedule.interests[index];

                  const mailList = await self.mailList.find({ interests: element.id });

                  if (mailList) {
                     for (let index = 0; index < mailList.length; index++) {
                        const element = mailList[index];

                        if (element.status) {
                           emails.push(element.email);
                        }
                     }
                  }
               }
            }

            console.log(emails);
            for (let index = 0; index < emails.length; index++) {
               const element = emails[index];

               try {
                  const sent = await this.emailService.sendMail(
                     element,
                     `New Quote ${schedule.name}`,
                     'index',
                     {
                        code: schedule.name,
                        username: schedule.nameNon,
                     },
                     false,
                  );

                  console.log(sent);
               } catch (error) {
                  console.log(error);
               }
            }
         }
      }
   }

   async createOnce(query: Record<string, any>, data: object): Promise<Interest> {
      return await this.interest.findOneAndUpdate(
         query,
         { $setOnInsert: data },
         { upsert: true, new: true, runValidators: true },
      );
   }
}
