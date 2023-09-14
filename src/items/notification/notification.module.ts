import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAuthService } from '@src/common/auth/user/services/auth.service';
import { RolesService } from '@src/common/roles/services/roles.service';
import { UserService } from '@src/common/users/services/user.service';
import { HelperService } from '@src/core/services/helper.service';
import { Notification, NotificationSchema } from '@src/schemas/notification.schema';
import { SchemasModule } from '@src/schemas/schemas.module';
import { NotificationResolver } from './notification.resolver';
import { NotificationsService } from './notification.services';
import { PubSubService } from '../pubsub.service';

@Module({
   imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), SchemasModule],
   providers: [
      NotificationsService,
      NotificationResolver,
      UserAuthService,
      UserService,
      RolesService,
      HelperService,
      PubSubService,
   ],
   exports: [NotificationsService, PubSubService],
})
export class NotificationModule {}
