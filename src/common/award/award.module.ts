import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeAwardController } from './admin/beAward.controller';
import { AwardService } from './services/award.service';
import { TransformerAwardService } from './services/transformerAward.service';
import { FeAwardController } from './frontend/feAward.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeAwardController, FeAwardController],
   providers: [AwardService, TransformerAwardService],
   exports: [AwardService, TransformerAwardService],
})
export class AwardModule { }
