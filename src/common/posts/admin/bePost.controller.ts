import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { HelperService } from '@core/services/helper.service';
import { BePostDto } from './dto/bePost.dto';
import { PostService } from '../services/post.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { Permissions } from '@core/services/permission.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { ChangeStatusDto } from './dto/changeStatus.dto';
import { NotificationsService } from '@src/items/notification/notification.services';
import { PubSubService } from '@src/items/pubsub.service';
import { UserAuth } from '@src/common/auth/user/decorators/user.decorator';
import { User } from '@src/schemas/user/user.schemas';
@ApiTags('Admin/Post')
@Controller('admin/posts')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BePostController {
   constructor(
      private post: PostService,
      private transformer: TransformerPostService,
      private response: ResponseService,
      private helper: HelperService,
      private notificationsService: NotificationsService,
      private pubSubService: PubSubService,
   ) {}

   @Get()
   @ACL(Permissions.post_list)
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.post.findAll(query);
      if (query.export && query.get) return this.transformer.transformPostExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformPostList(items));
   }

   @Get('total-post')
   @ACL(Permissions.post_list)
   async totalPost(@Query() query: Record<string, any>): Promise<any> {
      let items = await this.post.totalPost();
      if (!items) {
         items = 0;
      }
      return this.response.fetchListSuccess(items);
   }

   @Get('total-review-post')
   @ACL(Permissions.post_list)
   async totalReviewPost(@Query() query: Record<string, any>): Promise<any> {
      let items = await this.post.totalReviewPost();
      if (!items) {
         items = 0;
      }
      return this.response.fetchListSuccess(items);
   }

   @Get('total-published-post')
   @ACL(Permissions.post_list)
   async totalPublishedPost(@Query() query: Record<string, any>): Promise<any> {
      let items = await this.post.totalPublishedPost();
      if (!items) {
         items = 0;
      }
      return this.response.fetchListSuccess(items);
   }

   @Get(':id')
   @ACL(Permissions.post_detail)
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.post.findById(id);
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformPostDetail(item));
   }

   @Post()
   @ACL(Permissions.post_add)
   @HasFile()
   async add(@UploadedFiles() files, @Body() dto: BePostDto, @UserAuth() user: User): Promise<any> {
      const item = await this.post.create(dto, files);
      if (!item) return this.response.createdFail();
      console.log('user---->', user);
      let data = {
         type: 1,
         message: `Người dùng ${user?.name} vừa tạo bài viết mới`,
         data: item._id,
      };
      let notification = await this.notificationsService.create(data);
      notification['seen'] = false;
      this.pubSubService.publishPubSub('notification', {
         notification: notification,
      });
      return this.response.createdSuccess(await this.transformer.transformPostDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.post_edit)
   @HasFile()
   async edit(@UploadedFiles() files, @Param('id') id: string, @Body() dto: BePostDto): Promise<any> {
      const item = await this.post.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformPostDetail(item));
   }

   @Delete()
   @ACL(Permissions.post_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const items = await this.post.deleteManyById(ids);
      if (!items) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   @Post('change-status')
   @ACL(Permissions.post_change_status)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      let status = await this.post.changeStatus(dto);
      if (!status) return this.response.createdFail();
      return this.response.updatedSuccess(await this.transformer.transformPostDetail(status));
   }
}
