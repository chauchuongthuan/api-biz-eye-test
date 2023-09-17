import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BeTagDto } from './dto/beTag.dto';
import { TagService } from '../services/tag.service';
import { TransformerPostService } from '@common/posts/services/transformerPost.service';
import { ApiExcludeController, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { Permissions } from '@core/services/permission.service';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
@ApiTags('Admin/Tag')
@Controller('admin/tags')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
@ApiExcludeController()
export class BeTagController {
   constructor(private tag: TagService, private transformer: TransformerPostService, private response: ResponseService) {}

   @Get()
   @ACL(Permissions.tag_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.tag.findAll(query);
      if (query.export && query.get) return this.transformer.transformTagExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformTagList(items));
   }

   @Get(':id')
   @ACL(Permissions.tag_detail)
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.tag.findById(id);
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformTagDetail(item));
   }

   @Post()
   @ACL(Permissions.tag_add)
   async add(@Body() dto: BeTagDto): Promise<any> {
      const item = await this.tag.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformTagDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.tag_edit)
   async edit(@Param('id') id: string, @Body() dto: BeTagDto): Promise<any> {
      const item = await this.tag.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformTagDetail(item));
   }

   @Delete()
   @ACL(Permissions.tag_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const items = await this.tag.deleteManyById(ids);
      if (!items) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
