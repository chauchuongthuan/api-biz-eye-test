import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { RolesModule } from '../roles/roles.module';
import { ActivityModule } from '@common/activities/activity.module';
import { TokenDrawService } from './services/tokenDraw.service';
import { TransformerTokenDrawService } from './services/transformertokenDraw.service';
import { TokensDrawController } from './admin/tokenDraw.controller';
import { QueueModule } from '../queues/queues.module';
import { FeTokenDrawController } from './frontend/feTokenDraw.controller';

@Module({
   imports: [QueueModule, SchemasModule, RolesModule, ActivityModule],
   controllers: [TokensDrawController, FeTokenDrawController],
   providers: [TokenDrawService, TransformerTokenDrawService],
   exports: [TokenDrawService, TransformerTokenDrawService],
})
export class tokenDrawModule {}
