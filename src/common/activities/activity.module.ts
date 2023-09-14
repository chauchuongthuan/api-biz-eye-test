import { Module } from '@nestjs/common';
import { ActivityService } from '@common/activities/services/activity.service';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityController } from '@common/activities/admin/activity.controller';

@Module({
   imports: [SchemasModule],
   controllers: [ActivityController],
   providers: [ActivityService],
   exports: [ActivityService],
})
export class ActivityModule {}
