import { Module } from '@nestjs/common';
import { RolesController } from './admin/roles.controller';
import { RolesService } from './services/roles.service';
import { TransformerRoleService } from './services/transformerRole.service';
import { SchemasModule } from '@schemas/schemas.module';
import { PermissionsController } from '@common/roles/admin/permissions.controller';
import { ActivityModule } from '../activities/activity.module';
@Module({
   imports: [SchemasModule, ActivityModule],
   controllers: [RolesController, PermissionsController],
   providers: [RolesService, TransformerRoleService],
   exports: [RolesService, TransformerRoleService],
})
export class RolesModule {}
