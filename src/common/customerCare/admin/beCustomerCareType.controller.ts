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
import { CustomerCareTypeService } from '../services/customerCareType.service';
import { TransformerCustomerCareService } from '../services/transformerCustomerCare.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeCustomerCareTypeDto, ChangeStatusDto } from '../dto/beCustomerCareType.dto';

@ApiTags('Admin/CustomerCareType')
@Controller('admin/customer-care-types')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeCustomerCareTypeController {
   constructor(
      private customerCareTypeService: CustomerCareTypeService,
      private transformer: TransformerCustomerCareService,
      private response: ResponseService,
   ) {}

   // Find list customerCareTypes
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.customerCare_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.customerCareTypeService.findAll(query);
      if (query.get && query.export) return this.transformer.transformCustomerCareTypeExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCustomerCareTypeList(items));
   }

   // Create a new customerCareType

   @Post()
   @ApiBody({ type: BeCustomerCareTypeDto })
   @ACL(Permissions.customerCare_add)
   @HasFile()
   async create(@Body() dto: BeCustomerCareTypeDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.customerCareTypeService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCustomerCareTypeDetail(item));
   }

   // Update customerCareType

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.customerCare_edit)
   async update(
      @Param('id') id: string,
      @Body() dto: BeCustomerCareTypeDto,
      @UploadedFiles() files: Record<any, any>,
   ): Promise<any> {
      const item = await this.customerCareTypeService.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerCareTypeDetail(item));
   }

   // Delete customerCareType

   @Delete()
   @ACL(Permissions.customerCare_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.customerCareTypeService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get customerCareType by Id

   @Get(':id')
   @ACL(Permissions.customerCare_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const customerCareType = await this.customerCareTypeService.detail(id);
      if (!customerCareType) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCustomerCareTypeDetail(customerCareType));
   }

   @Post('change-status')
   @ACL(Permissions.subscriber_edit)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.customerCareTypeService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerCareListDetail(status));
   }
}
