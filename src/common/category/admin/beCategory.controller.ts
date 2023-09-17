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
import { CategoryService } from '../services/category.service';
import { TransformerCategoryService } from '../services/transformerCategory.service';
import { ACL } from '@src/common/auth/decorators/acl.decorator';
import { Permissions } from '@src/core/services/permission.service';
import { BeCategoryDto } from '../dto/beCategory.dto';

@ApiTags('Admin/Category')
@Controller('admin/category')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@ApiExcludeController()
export class BeCategoryController {
   constructor(
      private categoryService: CategoryService,
      private transformer: TransformerCategoryService,
      private response: ResponseService,
   ) {}

   // Find list categories
   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.categoryService.findAll(query);
      if (query.get && query.export) return this.transformer.transformCustomerExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformCategoryList(items));
   }

   // Create a new category

   @Post('')
   @HasFile()
   async create(@Body() dto: BeCategoryDto): Promise<any> {
      console.log('>>>>', dto.active);

      const item = await this.categoryService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCategoryetail(item));
   }

   // Update category

   @Put(':id')
   @HasFile()
   async update(@Param('id') id: string, @Body() dto: BeCategoryDto): Promise<any> {
      const item = await this.categoryService.update(id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCategoryetail(item));
   }

   // Delete category

   @Delete()
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.categoryService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   // Get category by Id

   @Get(':id')
   async getById(@Param('id') id: string): Promise<any> {
      const category = await this.categoryService.detail(id);
      if (!category) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCategoryetail(category));
   }
}
