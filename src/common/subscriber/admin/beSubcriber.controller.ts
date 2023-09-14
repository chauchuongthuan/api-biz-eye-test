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
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ApiBody, ApiTags, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { SubscriberService } from '../services/subscriber.service';
import { TransformerSubscriberService } from '../services/transformerSubscriber.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeSubscriberDto, ChangeStatusDto } from '../dto/beSubcriber.dto';

@ApiTags('Admin/Subscribers')
@Controller('admin/subscribers')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeSubscriberController {
   constructor(
      private subscriberService: SubscriberService,
      private transformer: TransformerSubscriberService,
      private response: ResponseService,
   ) {}

   // Find list Subscribers
   @Get()
   @DefaultListQuery()
   @ACL(Permissions.subscriber_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.subscriberService.findAll(query);
      if (query.get && query.export) return this.transformer.transformSubscriberExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformSubscriberList(items));
   }

   // Create a new subscriber

   @Post()
   @ApiBody({ type: BeSubscriberDto })
   @ACL(Permissions.subscriber_add)
   @HasFile()
   async create(@Body() dto: BeSubscriberDto): Promise<any> {
      const item = await this.subscriberService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformSubscriberDetail(item));
   }

   // Update subscriber

   @Put(':id')
   @ApiParam({ name: 'id', type: String })
   @HasFile()
   @ACL(Permissions.subscriber_edit)
   async update(@Param('id') id: string, @Body() dto: BeSubscriberDto): Promise<any> {
      const item = await this.subscriberService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformSubscriberDetail(item));
   }

   // Delete subscriber

   @Delete()
   @ACL(Permissions.subscriber_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.subscriberService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get subscriber by Id

   @Get(':id')
   @ACL(Permissions.subscriber_detail)
   async getById(@Param('id') id: string): Promise<any> {
      const subscriber = await this.subscriberService.detail(id);
      if (!subscriber) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformSubscriberDetail(subscriber));
   }

   @Post('change-status')
   @ACL(Permissions.subscriber_edit)
   async changeStatus(@Body() dto: ChangeStatusDto): Promise<any> {
      const status = await this.subscriberService.changeStatus(dto);
      if (!status) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformSubscriberDetail(status));
   }
}
