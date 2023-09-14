import { Body, Controller, Get, Post, Put, Delete, Request, UseInterceptors, UploadedFiles, Param, Query } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiParam, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { MailListService } from '../services/mailList.service';
import { TransformerMailListService } from '../services/transformerMarketingMail.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeMailListDto, ChangeStatusDto } from '../dto/beMailList.dto';

@ApiTags('Admin/MailLists')
@Controller('admin/mail-lists')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeMailListController {
   constructor(
      private mailListService: MailListService,
      private transformer: TransformerMailListService,
      private response: ResponseService,
   ) {}

   // Find list MailLists
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.mail_list_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.mailListService.findAll(query);
      if (query.get && query.export) return this.transformer.transformMailListExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformMailListList(items));
   }

   // Create a new mailList

   @Post()
   @ApiBody({ type: BeMailListDto })
   @ACL(Permissions.mail_list_add)
   @HasFile()
   async create(@Body() dto: BeMailListDto): Promise<any> {
      const item = await this.mailListService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformMailListDetail(item));
   }

   // Update mailList

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.mail_list_edit)
   async update(@Param('id') id: string, @Body() dto: BeMailListDto): Promise<any> {
      const item = await this.mailListService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformMailListDetail(item));
   }

   // Delete mailList

   @Delete()
   @ACL(Permissions.mail_list_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.mailListService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get mailList by Id

   @Get(':id')
   @ACL(Permissions.mail_list_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const mailList = await this.mailListService.detail(id);
      if (!mailList) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformMailListDetail(mailList));
   }

   @Post('change-status')
   @ACL(Permissions.mail_list_change_status)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.mailListService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformMailListDetail(status));
   }

   @Post('import')
   @HasFile()
   async importTokenDraw(@UploadedFiles() files: Record<any, any>): Promise<any> {
      const importFile = await this.mailListService.import(files[0]);
      return this.response.createdSuccess({}, `Đợi ${importFile} giây`);
   }
}
