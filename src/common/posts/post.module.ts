import { Module } from '@nestjs/common';
import { BePostCategoryController } from './admin/bePostCategory.controller';
import { BePostController } from './admin/bePost.controller';
import { BeTagController } from './admin/beTag.controller';
import { FePostCategoryController } from './frontend/fePostCategory.controller';
import { FePostController } from './frontend/fePost.controller';
import { FeTagController } from './frontend/feTag.controller';
import { PostCategoryService } from './services/postCategory.service';
import { PostService } from './services/post.service';
import { TagService } from './services/tag.service';
import { TransformerPostService } from './services/transformerPost.service';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '../activities/activity.module';
import { UserModule } from '../users/user.module';
import { PostCommentService } from './services/postComment.service';
import { BePostCommentController } from './admin/bePostComment.controller';
import { NotificationsService } from '@src/items/notification/notification.services';
import { PubSubService } from '@src/items/pubsub.service';

@Module({
   imports: [SchemasModule, ActivityModule, UserModule],
   controllers: [
      BePostCategoryController,
      BePostController,
      BePostCommentController,
      FePostCategoryController,
      FePostController,
      BeTagController,
      FeTagController,
   ],
   providers: [
      PostService,
      PostCategoryService,
      TagService,
      PostCommentService,
      TransformerPostService,
      NotificationsService,
      PubSubService,
   ],
   exports: [
      PostService,
      PostCategoryService,
      TagService,
      PostCommentService,
      TransformerPostService,
      NotificationsService,
      PubSubService,
   ],
})
export class PostModule {}
