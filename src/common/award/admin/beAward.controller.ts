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
import { AwardService } from '../services/award.service';
import { TransformerAwardService } from '../services/transformerAward.service';
import { BeAwardDto } from '../dto/beAward.dto';

@ApiTags('Admin/award')
@Controller('admin/award')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeAwardController {
   constructor(
      private awardService: AwardService,
      private transformer: TransformerAwardService,
      private response: ResponseService,
   ) { }

   // Find list categories
   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      console.log('hi there');
      const items = await this.awardService.findAll(query);
      if (!items) return this.response.createdFail();
      return this.response.fetchListSuccess(await this.transformer.transformAwardList(items));
   }

   // Create a new category

   @Post('')
   @HasFile()
   async create(@Body() dto: BeAwardDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      const item = await this.awardService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformAwardetail(item));
   }

   // Update category

   @Put(':id')
   @HasFile()
   async update(@Param('id') id: string, @Body() dto: BeAwardDto): Promise<any> {
      const item = await this.awardService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformAwardetail(item));
   }

   // Delete category

   @Delete()
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.awardService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get category by Id

   @Get(':id')
   async getById(@Param('id') id: string): Promise<any> {
      const category = await this.awardService.detail(id);
      if (!category) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformAwardetail(category));
   }
}
