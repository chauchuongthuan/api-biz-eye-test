import { Controller, Get, Query, Param, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@src/core/decorators/defaultListQuery.decorator';
import { AwardPostService } from '../services/postAward.service';
import { TransformerPostAwardService } from '../services/transformerPostAward.service';
@ApiTags('Frontend/post-award')
@Controller('post-award')
@UseInterceptors(CoreTransformInterceptor)
export class FeAwardPostController {
   constructor(
      private awardService: AwardPostService,
      private transformer: TransformerPostAwardService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   @applyDecorators(
      ApiQuery({
         required: false,
         name: 'category',
         description: 'id of category',
      }),
   )
   @applyDecorators(
      ApiQuery({
         required: false,
         name: 'expertise',
         description: 'id of expertise',
      }),
   )
   async getAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.awardService.findAll(query);
      if (items) this.response.createdFail();
      return this.response.fetchListSuccess(await this.transformer.transformAwardList(items));
   }

   @Get(':slug')
   async findBySlug(@Param('slug') slug: string): Promise<any> {
      const item = await this.awardService.findBySlug(slug);

      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformAwardetail(item));
   }
}
