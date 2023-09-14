import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HistoryService } from './services/history.service';
import { TransformerHistoryService } from './services/transformerHistory.service';
import { BeHistoryController } from './admin/beChatHistory.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeHistoryController],
   providers: [HistoryService, TransformerHistoryService],
   exports: [HistoryService, TransformerHistoryService],
})
export class ChatHistoryModule {}
