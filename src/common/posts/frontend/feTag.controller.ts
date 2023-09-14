import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { TagService } from '../services/tag.service';
import { TransformerPostService } from '@common/posts/services/transformerPost.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
@ApiTags('Frontend/Tag')
@Controller('tags')
@UseInterceptors(CoreTransformInterceptor)
export class FeTagController {
   constructor(private tag: TagService, private transformer: TransformerPostService, private response: ResponseService) {}

   @Get()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.tag.findAllFrontend(query);
      return this.response.fetchListSuccess(await this.transformer.transformTagList(items));
   }

   @Get(':slug')
   async findBySlug(@Param('slug') slug: string): Promise<any> {
      const item = await this.tag.findBySlug(slug);
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformTagDetail(item));
   }
}
