import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeExpertiseController } from './admin/beCategory.controller';
import { ExpertiseService } from './services/expertise.service';
import { TransformerExpertiseService } from './services/transformerCategory.service';
import { FeExpertiseController } from './frontend/feExpertise.controller';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeExpertiseController, FeExpertiseController],
   providers: [ExpertiseService, TransformerExpertiseService],
   exports: [ExpertiseService, TransformerExpertiseService],
})
export class ExpertiseModule { }
