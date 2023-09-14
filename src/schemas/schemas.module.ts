import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schemas';
import { TokenBlacklist, TokenBlacklistSchema } from './user/tokenBlacklist.schema';
import { User, UserSchema } from './user/user.schemas';
import { Customer, CustomerSchema } from './customer/customer.schemas';
import { Activity, ActivitySchema } from '@schemas/activities/activity.schema';
const mongoosePaginate = require('mongoose-paginate-v2');
import { Page, PageSchema } from './page/page.schema';
import { Setting, SettingSchema } from './setting.schemas';
import { Category, CategorySchema } from './category/category.schema';
import { Author, AuthorSchema } from './author/author.schemas';
import { Stories, StoriesSchema } from './story/story.schemas';
import { PostCategory, PostCategorySchema } from './posts/postCategory.schemas';
import { Post, PostSchema } from './posts/post.schemas';
import { Tag, TagSchema } from './posts/tag.schemas';
import { Backups, BackupsSchema } from './database/database.schemas';
import { Contact, ContactSchema } from './contact/contact.schema';
import { Subscriber, SubscriberSchema } from './subscriber/subscriber.schema';
import { Interest, InterestSchema } from './marketing/interest.schema';
import { MailList, MailListSchema } from './marketing/mailList.schema';
import { MailSchedule, MailScheduleSchema } from './marketing/mailSchedule.schema';
import { CustomerCareList, CustomerCareListSchema } from './customerCare/customerCareList.schema';
import { CustomerCareType, CustomerCareTypeSchema } from './customerCare/customerCareType.schema';
import { TokenDraw, TokenDrawSchema } from './tokenDraw/tokenDraw';
import { PostComment, PostCommentSchema } from './posts/postComment.schemas';
import { History, HistorySchema } from './history/history.schema';
import { Notification, NotificationSchema } from './notification.schema';
import { Seen, SeenSchema } from './seens.schema';

const modelSchemas = [
   MongooseModule.forFeature([{ name: TokenBlacklist.name, schema: TokenBlacklistSchema }]),
   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
   MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
   MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }]),
   MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
   MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),

   // Core Models
   MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
   MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
   MongooseModule.forFeature([{ name: Stories.name, schema: StoriesSchema }]),

   // Tin tức
   MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
   MongooseModule.forFeature([{ name: PostCategory.name, schema: PostCategorySchema }]),
   MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
   MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
   MongooseModule.forFeature([{ name: PostComment.name, schema: PostCommentSchema }]),

   // Database backup
   MongooseModule.forFeature([{ name: Backups.name, schema: BackupsSchema }]),

   //Liên hệ
   MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),

   //Subscriber
   MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),

   //Marketing
   MongooseModule.forFeature([{ name: Interest.name, schema: InterestSchema }]),
   MongooseModule.forFeature([{ name: MailList.name, schema: MailListSchema }]),
   MongooseModule.forFeature([{ name: MailSchedule.name, schema: MailScheduleSchema }]),

   //CustomerCare
   MongooseModule.forFeature([{ name: CustomerCareList.name, schema: CustomerCareListSchema }]),
   MongooseModule.forFeature([{ name: CustomerCareType.name, schema: CustomerCareTypeSchema }]),

   // Lucky Draw
   MongooseModule.forFeature([{ name: TokenDraw.name, schema: TokenDrawSchema }]),

   // History question to chat GPT
   MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),

   //notification
   MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
   MongooseModule.forFeature([{ name: Seen.name, schema: SeenSchema }]),
];

@Module({
   imports: [
      MongooseModule.forRootAsync({
         imports: [],
         inject: [],
         useFactory: async () => {
            mongoosePaginate.paginate.options = {
               customLabels: {
                  docs: 'docs',
                  totalDocs: 'total',
                  limit: 'limit',
                  page: 'currentPage',
                  nextPage: 'next',
                  prevPage: 'prev',
                  totalPages: 'pageCount',
                  pagingCounter: 'slNo',
                  meta: 'paginator',
               },
            };
            return {
               uri: process.env.DB_CONNECTION_STRING,
               connectionFactory: (connection: Record<any, any>): any => {
                  connection.plugin(require('./utils/plugins/uploadFile'));
                  connection.plugin(require('./utils/plugins/setViNon'));
                  // connection.plugin(require('./plugins/updatedAt'));
                  connection.plugin(require('mongoose-paginate-v2'));
                  return connection;
               },
            };
         },
      }),
      ...modelSchemas,
   ],
   exports: [MongooseModule, ...modelSchemas],
})
export class SchemasModule {}
