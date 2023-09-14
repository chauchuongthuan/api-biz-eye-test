import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeStoryController } from './admin/beStory.controller';
import { StoryService } from './services/story.service';
import { TransformerStoryService } from './services/transformerStory.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeStoryController],
   providers: [StoryService, TransformerStoryService],
   exports: [StoryService, TransformerStoryService],
})
export class StoryModule {}
