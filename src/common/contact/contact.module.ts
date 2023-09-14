import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeContactController } from './admin/beContact.controller';
import { ContactService } from './services/contact.service';
import { TransformerContactService } from './services/transformerContact.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeContactController],
   providers: [ContactService, TransformerContactService],
   exports: [ContactService, TransformerContactService],
})
export class ContactModule {}
