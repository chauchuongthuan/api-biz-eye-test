import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeAuthorController } from './admin/beAuthor.controller';
import { AuthorService } from './services/author.service';
import { TransformerAuthorService } from './services/transformerAuthor.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeAuthorController],
   providers: [AuthorService, TransformerAuthorService],
   exports: [AuthorService, TransformerAuthorService],
})
export class AuthorModule {}
