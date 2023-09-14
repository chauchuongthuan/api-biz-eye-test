import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeMailListController } from './admin/beMailList.controller';
import { MailListService } from './services/mailList.service';
import { TransformerMailListService } from './services/transformerMarketingMail.service';
import { BeInterestController } from './admin/beInterest.controller';
import { InterestService } from './services/interest.service';
import { QueueModule } from '../queues/queues.module';
import { MailScheduleService } from './services/mailSchedule.service';
import { BeMailScheduleController } from './admin/beMailSchedule.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot(), QueueModule],
   controllers: [BeMailListController, BeInterestController, BeMailScheduleController],
   providers: [MailListService, InterestService, MailScheduleService, TransformerMailListService],
   exports: [MailListService, InterestService, MailScheduleService, TransformerMailListService],
})
export class MarketingMailModule {}
