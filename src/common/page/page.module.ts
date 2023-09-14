import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { PageService } from './services/page.service';
import { UserService } from '../users/services/user.service';
import { UserAuthService } from '../auth/user/services/auth.service';
import { TransformerPageService } from './services/transformerPage.service';
import { ActivityModule } from 'src/common/activities/activity.module';
import { BePageController } from './admin/bePage.controller';
import { FePageController } from './frontend/fePage.controller';

@Module({
   imports: [SchemasModule, ActivityModule],
   controllers: [BePageController, FePageController],
   providers: [PageService, UserService, UserAuthService, TransformerPageService],
   exports: [PageService, UserService, UserAuthService, TransformerPageService],
})
export class PageModule {}
