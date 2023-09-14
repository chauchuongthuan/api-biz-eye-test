import { Module } from '@nestjs/common';
import { GptService } from './services/gpt.service';
import { SchemasModule } from '@schemas/schemas.module';
import { BeGptController } from '@common/chatgpt/admin/beGpt.controller';
import { TransformerGptService } from './services/transformerGpt.service';
import { ActivityModule } from '@common/activities/activity.module';
import { HttpModule } from '@nestjs/axios';
@Module({
   imports: [
      SchemasModule,
      ActivityModule,
      HttpModule.register({
         timeout: 50000,
      }),
   ],
   controllers: [BeGptController],
   providers: [GptService, TransformerGptService],
   exports: [GptService, TransformerGptService],
})
export class GptModule {}
