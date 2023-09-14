import {
   Body,
   Controller,
   Get,
   Post,
   Put,
   Request,
   UseInterceptors,
   UploadedFiles,
   Param,
   Query,
   HttpStatus,
} from '@nestjs/common';
import { ResponseService } from 'src/core/services/response.service';
import { PageService } from '../services/page.service';
import { ApiTags } from '@nestjs/swagger';
import { TransformerPageService } from '../services/transformerPage.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Page')
@Controller('pages')
// @UseInterceptors(CoreTransformInterceptor)
export class FePageController {
   constructor(
      private pageService: PageService,
      private response: ResponseService,
      private transformer: TransformerPageService,
   ) {}

   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.pageService.findAll(query);
      return this.response.fetchListSuccess(await this.transformer.transformPageList(items));
   }

   @Get(':id')
   @DefaultListQuery()
   async detail(@Param('id') id) {
      const page = await this.pageService.detail(id);
      if (!page) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformPageDetail(page));
   }
}
