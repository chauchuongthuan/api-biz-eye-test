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
import { ApiBody, ApiTags, ApiHeader } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { HistoryService } from '../services/history.service';
import { TransformerCategoryService } from '@src/common/category/services/transformerCategory.service';
import { TransformerHistoryService } from '../services/transformerHistory.service';

@ApiTags('Admin/History')
@Controller('admin/history')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeHistoryController {
   constructor(
      private historyService: HistoryService,
      private transformer: TransformerHistoryService,
      private response: ResponseService,
   ) {}

   // Find list history chatGPT
   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.historyService.findAll(query);
      return this.response.fetchListSuccess(await this.transformer.transformHistoryList(items));
   }
}
