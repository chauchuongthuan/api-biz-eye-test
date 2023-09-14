import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeSubscriberController } from './admin/beSubcriber.controller';
import { SubscriberService } from './services/subscriber.service';
import { TransformerSubscriberService } from './services/transformerSubscriber.service';
import { FeSubscriberController } from './frontend/feSubcriber.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeSubscriberController, FeSubscriberController],
   providers: [SubscriberService, TransformerSubscriberService],
   exports: [SubscriberService, TransformerSubscriberService],
})
export class SubscriberModule {}
