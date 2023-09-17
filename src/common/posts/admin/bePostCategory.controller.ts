import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BePostCategoryDto } from './dto/bePostCategory.dto';
import { PostCategoryService } from '../services/postCategory.service';
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
@ApiTags('Admin/PostCategory')
@Controller('admin/post-categories')
@ApiExcludeController()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class BePostCategoryController {
   constructor(
      private category: PostCategoryService,
      private transformer: TransformerPostService,
      private response: ResponseService,
   ) {}

   @Get()
   @ACL(Permissions.post_category_list)
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.category.findAll(query);
      if (query.export && query.get) return this.transformer.transformCategoryExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCategoryList(items));
   }

   @Get(':id')
   @ACL(Permissions.post_category_detail)
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.category.findById(id);
      if (!item) return this.response.detailFail();
      await saveFileContent('content', item, 'postCategories', false);
      return this.response.detailSuccess(await this.transformer.transformCategoryDetail(item));
   }

   @Post()
   @ACL(Permissions.post_category_add)
   @HasFile()
   async add(@UploadedFiles() files, @Body() dto: BePostCategoryDto): Promise<any> {
      const item = await this.category.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCategoryDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.post_category_edit)
   @HasFile()
   async edit(
      @UploadedFiles() files,
      // @Body('contentRmImgs') contentRmImgs: Array<string>,
      @Param('id') id: string,
      @Body() dto: BePostCategoryDto,
   ): Promise<any> {
      const item = await this.category.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCategoryDetail(item));
   }

   @Delete()
   @ACL(Permissions.post_category_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const items = await this.category.deletes(ids);
      if (!items) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
