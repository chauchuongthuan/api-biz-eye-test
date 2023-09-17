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
import { ApiBody, ApiTags, ApiHeader, ApiExcludeController } from '@nestjs/swagger';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { AwardService } from '../services/award.service';
import { TransformerAwardService } from '../services/transformerAward.service';
import { BeAwardDto } from '../dto/beAward.dto';
import { TransformerPostAwardService } from '../services/transformerPostAward.service';
import { AwardPostService } from '../services/postAward.service';

@ApiTags('Admin/Post Award')
@Controller('admin/post-award')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BePostAwardController {
   constructor(
      private awardService: AwardPostService,
      private transformer: TransformerPostAwardService,
      private response: ResponseService,
   ) { }

   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.awardService.findAll(query);
      if (!items) return this.response.createdFail();
      return this.response.fetchListSuccess(await this.transformer.transformAwardList(items));
   }

   @Post('')
   @HasFile()
   async create(@Body() dto: any, @UploadedFiles() files: Record<any, any>): Promise<any> {
      console.log(123);

      const item = await this.awardService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformAwardetail(item));
   }

   @Put(':id')
   @HasFile()
   async update(@Param('id') id: string, @Body() dto: any): Promise<any> {
      const item = await this.awardService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformAwardetail(item));
   }

   @Delete()
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.awardService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   @Get(':id')
   async getById(@Param('id') id: string): Promise<any> {
      const category = await this.awardService.detail(id);
      if (!category) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformAwardetail(category));
   }
}
