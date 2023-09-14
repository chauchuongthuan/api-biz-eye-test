import { Module } from '@nestjs/common';
// import { UploadScheduleService } from './services/uploadSchedule.service';
import { CronService } from '@src/core/services/cron.service';
import { SchemasModule } from '@src/schemas/schemas.module';
import { PostModule } from '../posts/post.module';
import { publishPostScheduleService } from './service/publishPostSchedule.service';
import { deleteAccessByMonthScheduleService } from './service/deleteAccessByMonthSchedule.service';
import { getAccessByMinuteScheduleService } from './service/getAccessByMinuteSchedule.service';
import { ItemModule } from '@src/items/item.module';
import { QueueModule } from '../queues/queues.module';
import { sendMailScheduleService } from './service/sendMailSchedule.service';

@Module({
   imports: [SchemasModule, PostModule, ItemModule, QueueModule],
   providers: [
      CronService,
      publishPostScheduleService,
      deleteAccessByMonthScheduleService,
      getAccessByMinuteScheduleService,
      sendMailScheduleService,
   ],
   exports: [
      CronService,
      publishPostScheduleService,
      deleteAccessByMonthScheduleService,
      getAccessByMinuteScheduleService,
      sendMailScheduleService,
   ],
})
export class TaskScheduleModule {}
