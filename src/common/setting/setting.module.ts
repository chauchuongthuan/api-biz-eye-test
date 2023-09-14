import { Module } from '@nestjs/common';
import { BeSettingController } from './admin/beSetting.controller';
import { FeSettingController } from './frontend/feSetting.controller';
import { SettingService } from './services/setting.service';
import { TransformerSettingService } from './services/transformerSetting.service';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
@Module({
   imports: [SchemasModule, ActivityModule],
   controllers: [BeSettingController, FeSettingController],
   providers: [SettingService, TransformerSettingService],
   exports: [SettingService, TransformerSettingService],
})
export class SettingModule {}
