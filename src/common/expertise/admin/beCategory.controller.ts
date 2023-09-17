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
import { ExpertiseService } from '../services/expertise.service';
import { TransformerExpertiseService } from '../services/transformerCategory.service';
import { BeExpertiseDto } from '../dto/beExpertise.dto';

@ApiTags('Admin/Expertise')
@Controller('admin/expertise')
@UserSecure()
@ApiExcludeController()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeExpertiseController {
   constructor(
      private expertiseService: ExpertiseService,
      private transformer: TransformerExpertiseService,
      private response: ResponseService,
   ) { }

   // Find list categories
   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.expertiseService.findAll(query);
      if (query.get && query.export) return this.transformer.transformCustomerExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformExpertiseList(items));
   }

   // Create a new category

   @Post('')
   @HasFile()
   async create(@Body() dto: BeExpertiseDto): Promise<any> {
      console.log('>>>>', dto.active);

      const item = await this.expertiseService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformExpertiseDetail(item));
   }

   // Update category

   @Put(':id')
   @HasFile()
   async update(@Param('id') id: string, @Body() dto: BeExpertiseDto): Promise<any> {
      const item = await this.expertiseService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformExpertiseDetail(item));
   }

   // Delete category

   @Delete()
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.expertiseService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get category by Id

   @Get(':id')
   async getById(@Param('id') id: string): Promise<any> {
      const category = await this.expertiseService.detail(id);
      if (!category) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformExpertiseDetail(category));
   }
}
