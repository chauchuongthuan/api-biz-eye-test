import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { saveFileContent } from '@core/helpers/content';
import { CategoryService } from '../services/category.service';
import { TransformerCategoryService } from '../services/transformerCategory.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Frontend/category')
@Controller('category')
@UseInterceptors(CoreTransformInterceptor)
export class FeCategoryController {
   constructor(
      private categoryService: CategoryService,
      private transformer: TransformerCategoryService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   async getAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.categoryService.findAll(query);
      return this.response.fetchListSuccess(await this.transformer.transformCategoryList(items));
   }
}
