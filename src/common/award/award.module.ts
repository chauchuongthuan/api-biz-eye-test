import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeAwardController } from './admin/beAward.controller';
import { AwardService } from './services/award.service';
import { TransformerAwardService } from './services/transformerAward.service';
import { FeAwardController } from './frontend/feAward.controller';
import { BePostAwardController } from './admin/bePostAward.controller';
import { AwardPostService } from './services/postAward.service';
import { TransformerPostAwardService } from './services/transformerPostAward.service';
import { FeAwardPostController } from './frontend/fePostAward.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeAwardController, FeAwardController, BePostAwardController, FeAwardPostController],
   providers: [AwardService, TransformerAwardService, AwardPostService, TransformerPostAwardService],
   exports: [AwardService, TransformerAwardService, AwardPostService, TransformerPostAwardService],
})
export class AwardModule { }
