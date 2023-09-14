import { Body, Controller, Get, Post, Put, Delete, Request, UseInterceptors, UploadedFiles, Param, Query } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiParam, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { MailScheduleService } from '../services/mailSchedule.service';
import { TransformerMailListService } from '../services/transformerMarketingMail.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeMailScheduleDto, ChangeStatusDto } from '../dto/beMailSchedule.dto';

@ApiTags('Admin/MailSchedules')
@Controller('admin/mail-schedules')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeMailScheduleController {
   constructor(
      private mailScheduleService: MailScheduleService,
      private transformer: TransformerMailListService,
      private response: ResponseService,
   ) {}

   // Find list MailSchedules
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.mail_schedule_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.mailScheduleService.findAll(query);
      if (query.get && query.export) return this.transformer.transformMailScheduleExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformMailScheduleList(items));
   }

   // Create a new mailSchedule

   @Post()
   @ApiBody({ type: BeMailScheduleDto })
   @ACL(Permissions.mail_schedule_add)
   @HasFile()
   async create(@Body() dto: BeMailScheduleDto): Promise<any> {
      const item = await this.mailScheduleService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformMailScheduleDetail(item));
   }

   // Update mailSchedule

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.mail_schedule_edit)
   async update(@Param('id') id: string, @Body() dto: BeMailScheduleDto): Promise<any> {
      const item = await this.mailScheduleService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformMailScheduleDetail(item));
   }

   // Delete mailSchedule

   @Delete()
   @ACL(Permissions.mail_schedule_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.mailScheduleService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get mailSchedule by Id

   @Get(':id')
   @ACL(Permissions.mail_schedule_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const mailSchedule = await this.mailScheduleService.detail(id);
      if (!mailSchedule) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformMailScheduleDetail(mailSchedule));
   }

   @Post('change-status')
   @ACL(Permissions.mail_schedule_change_status)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.mailScheduleService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformMailScheduleDetail(status));
   }
}
