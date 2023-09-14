import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { RolesModule } from '../roles/roles.module';
import { TransformerUserService } from './services/transformerUser.service';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ActivityModule } from '@common/activities/activity.module';

@Module({
   imports: [SchemasModule, RolesModule, ActivityModule],
   controllers: [UserController],
   providers: [UserService, TransformerUserService],
   exports: [UserService, TransformerUserService],
})
export class UserModule {}
