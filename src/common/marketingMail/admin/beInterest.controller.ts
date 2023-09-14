import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BeInterestDto, ChangeStatusDto } from '../dto/beInterest.dto';
import { InterestService } from '../services/interest.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { Permissions } from '@core/services/permission.service';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { TransformerMailListService } from '../services/transformerMarketingMail.service';
@ApiTags('Admin/Interest')
@Controller('admin/interests')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
@ApiExcludeController()
export class BeInterestController {
   constructor(
      private interest: InterestService,
      private transformer: TransformerMailListService,
      private response: ResponseService,
   ) {}

   @Get()
   @ACL(Permissions.interest_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.interest.findAll(query);
      if (query.export && query.get) return this.transformer.transformInterestExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformInterestList(items));
   }

   @Get(':id')
   @ACL(Permissions.interest_detail)
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.interest.findById(id);
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformInterestDetail(item));
   }

   @Post()
   @ACL(Permissions.interest_add)
   async add(@Body() dto: BeInterestDto): Promise<any> {
      const item = await this.interest.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformInterestDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.interest_edit)
   async edit(@Param('id') id: string, @Body() dto: BeInterestDto): Promise<any> {
      const item = await this.interest.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformInterestDetail(item));
   }

   @Post('change-status')
   @ACL(Permissions.mail_list_change_status)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.interest.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformMailListDetail(status));
   }

   @Delete()
   @ACL(Permissions.interest_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const items = await this.interest.deleteManyById(ids);
      if (!items) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
