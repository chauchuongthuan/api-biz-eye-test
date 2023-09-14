import {
   Body,
   Controller,
   Get,
   Post,
   Put,
   Delete,
   Request,
   UseInterceptors,
   UploadedFiles,
   Param,
   Query,
   UseGuards,
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { CustomerCareListService } from '../services/customerCareList.service';
import { TransformerCustomerCareService } from '../services/transformerCustomerCare.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeCustomerCareListDto, ChangeStatusDto } from '../dto/beCustomerCareList.dto';

@ApiTags('Admin/CustomerCareList')
@Controller('admin/customer-care-lists')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeCustomerCareListController {
   constructor(
      private customerCareListService: CustomerCareListService,
      private transformer: TransformerCustomerCareService,
      private response: ResponseService,
   ) {}

   // Find list customerCareLists
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.customerCare_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.customerCareListService.findAll(query);
      if (query.get && query.export) return this.transformer.transformCustomerCareListExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCustomerCareListList(items));
   }

   // Create a new customerCareList

   @Post()
   @ApiBody({ type: BeCustomerCareListDto })
   @ACL(Permissions.customerCare_add)
   @HasFile()
   async create(@Body() dto: BeCustomerCareListDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.customerCareListService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCustomerCareListDetail(item));
   }

   // Update customerCareList

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.customerCare_edit)
   async update(
      @Param('id') id: string,
      @Body() dto: BeCustomerCareListDto,
      @UploadedFiles() files: Record<any, any>,
   ): Promise<any> {
      const item = await this.customerCareListService.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerCareListDetail(item));
   }

   // Delete customerCareList

   @Delete()
   @ACL(Permissions.customerCare_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.customerCareListService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get customerCareList by Id

   @Get(':id')
   @ACL(Permissions.customerCare_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const customerCareList = await this.customerCareListService.detail(id);
      if (!customerCareList) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCustomerCareListDetail(customerCareList));
   }

   @Post('change-status')
   @ACL(Permissions.subscriber_edit)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.customerCareListService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerCareListDetail(status));
   }
}
