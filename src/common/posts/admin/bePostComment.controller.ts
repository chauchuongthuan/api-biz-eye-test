import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BePostCommentDto } from './dto/bePostComment.dto';
import { PostCommentService } from '../services/postComment.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiExcludeController, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { saveFileContent } from '@core/helpers/content';
import { Permissions } from '@core/services/permission.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
@ApiTags('Admin/PostComment')
@Controller('admin/post-comments')
@ApiExcludeController()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BePostCommentController {
   constructor(
      private comment: PostCommentService,
      private transformer: TransformerPostService,
      private response: ResponseService,
   ) {}

   @Get()
   @ACL(Permissions.post_comment_list)
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.comment.findAll(query);
      // if (query.export && query.get) return this.transformer.transformCommentExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCommentList(items));
   }

   @Get(':id')
   @ACL(Permissions.post_comment_detail)
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.comment.findById(id);
      if (!item) return this.response.detailFail();
      await saveFileContent('content', item, 'postComments', false);
      return this.response.detailSuccess(await this.transformer.transformCommentDetail(item));
   }

   @Post()
   @ACL(Permissions.post_comment_add)
   @HasFile()
   async add(@UploadedFiles() files, @Body() dto: BePostCommentDto): Promise<any> {
      const item = await this.comment.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCommentDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.post_comment_edit)
   @HasFile()
   async edit(
      @UploadedFiles() files,
      // @Body('contentRmImgs') contentRmImgs: Array<string>,
      @Param('id') id: string,
      @Body() dto: BePostCommentDto,
   ): Promise<any> {
      const item = await this.comment.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCommentDetail(item));
   }

   @Delete()
   @ACL(Permissions.post_comment_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const items = await this.comment.deletes(ids);
      if (!items) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
