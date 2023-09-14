import { Body, Controller, Get, Post, Put, Delete, UseInterceptors, Param, Query } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@core/services/permission.service';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { StoryService } from '../services/story.service';
import { TransformerStoryService } from '../services/transformerStory.service';

@ApiTags('Admin/Stories')
@Controller('admin/story')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeStoryController {
   constructor(
      private storyService: StoryService,
      private transformer: TransformerStoryService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   @ACL(Permissions.story_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.storyService.findAll(query);
      if (query.get && query.export) return await this.transformer.transformStoryExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformStoryList(items));
   }

   @Get(':id')
   @ACL(Permissions.story_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const customer = await this.storyService.detail(id);
      if (!customer) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformStoryDetail(customer));
   }

   @Post()
   @ACL(Permissions.story_add)
   async create(@Body() dto: any): Promise<any> {
      const item = await this.storyService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformStoryDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.story_edit)
   async update(@Param('id') id: string, @Body() dto: any): Promise<any> {
      const item = await this.storyService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformStoryDetail(item));
   }

   @ApiBody({ type: Array })
   @Delete()
   @ACL(Permissions.customer_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.storyService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
