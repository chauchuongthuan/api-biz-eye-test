import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthService } from '@src/common/auth/user/services/auth.service';
import { RolesService } from '@src/common/roles/services/roles.service';
import { UserService } from '@src/common/users/services/user.service';
import { HelperService } from '@src/core/services/helper.service';
import { SchemasModule } from '@src/schemas/schemas.module';
import { PubSubService } from './pubsub.service';
import { Setting, SettingSchema } from '@src/schemas/setting.schemas';
import { AccessesService } from './item.service';
import { AccessByMinuteResolver } from './item.resolver';

@Module({
   imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]), SchemasModule],
   providers: [AccessesService, AccessByMinuteResolver, UserAuthService, UserService, RolesService, HelperService, PubSubService],
   exports: [AccessesService, PubSubService],
})
export class ItemModule {}
