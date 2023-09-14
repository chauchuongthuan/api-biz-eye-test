import { Body, Controller, Get, Post, Put, Delete, UseInterceptors, Param, Query } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@core/services/permission.service';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { AuthorService } from '../services/author.service';
import { TransformerAuthorService } from '../services/transformerAuthor.service';
import { BeAuthorDto } from '../dto/beAuthor.dto';

@ApiTags('Admin/Authors')
@Controller('admin/author')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeAuthorController {
   constructor(
      private authorService: AuthorService,
      private transformer: TransformerAuthorService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   @ACL(Permissions.author_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.authorService.findAll(query);
      if (query.get && query.export) return await this.transformer.transformAuthorExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformAuthorList(items));
   }

   @Get(':id')
   @ACL(Permissions.author_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const customer = await this.authorService.detail(id);
      if (!customer) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformAuthorDetail(customer));
   }

   @Post()
   @ACL(Permissions.author_add)
   async create(@Body() dto: BeAuthorDto): Promise<any> {
      const item = await this.authorService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformAuthorDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.author_edit)
   async update(@Param('id') id: string, @Body() dto: BeAuthorDto): Promise<any> {
      const item = await this.authorService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformAuthorDetail(item));
   }

   @ApiBody({ type: Array })
   @Delete()
   @ACL(Permissions.customer_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.authorService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
