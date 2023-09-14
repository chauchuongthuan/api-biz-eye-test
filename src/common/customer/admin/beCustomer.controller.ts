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
import { TransformerCustomerService } from '@common/customer/services/transformerCustomer.service';
import { ResponseService } from '@core/services/response.service';
import { BeCustomerDto, ChangeStatusDto } from '../dto/beCustomer.dto';
import { CustomerService } from '../services/backend/customer.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Permissions } from '@core/services/permission.service';
const moment = require('moment');
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { HasFile } from '@src/core/decorators/hasFile.decorator';

@ApiTags('Admin/Customers')
@Controller('admin/customers')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeCustomerController {
   constructor(
      private customerService: CustomerService,
      private transformer: TransformerCustomerService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   @ACL(Permissions.customer_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.customerService.findAll(query);
      if (query.get && query.export) return await this.transformer.transformCustomerExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCustomerList(items));
   }

   @Get(':id')
   @ACL(Permissions.customer_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const customer = await this.customerService.detail(id);
      if (!customer) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCustomerDetail(customer));
   }

   @Post()
   @ApiExcludeEndpoint()
   @ACL(Permissions.customer_edit)
   @HasFile()
   async create(@Body() dto: BeCustomerDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.customerService.create(dto, files);
      if (!item.status) return this.response.createdFail(item.message);
      return this.response.createdSuccess(await this.transformer.transformCustomerDetail(item));
   }

   @Put(':id')
   @ApiExcludeEndpoint()
   @ACL(Permissions.customer_edit)
   @HasFile()
   async update(@Param('id') id: string, @Body() dto: BeCustomerDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.customerService.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerDetail(item));
   }

   @ApiBody({ type: Array })
   @Delete()
   @ACL(Permissions.customer_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.customerService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   @Post('change-status')
   @ACL(Permissions.subscriber_edit)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.customerService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerDetail(status));
   }
}
