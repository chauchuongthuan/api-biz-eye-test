import { Controller, Get, Query, Param, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { PostService } from '../services/post.service';
import { TransformerPostService } from '../services/transformerPost.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { DefaultListQuery } from '@src/core/decorators/defaultListQuery.decorator';
@ApiTags('Frontend/Post')
@Controller('posts')
@UseInterceptors(CoreTransformInterceptor)
export class FePostController {
   constructor(private post: PostService, private transformer: TransformerPostService, private response: ResponseService) { }

   @Get()
   @applyDecorators(ApiQuery({ required: false, name: 'title', description: 'Title', example: 'Test name' }))
   @applyDecorators(
      ApiQuery({ required: false, name: 'postCategory', description: 'Post Category id', example: '6246a60a6d6114ef8d9bc6a5' }),
   )
   @DefaultListQuery()
   async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.post.findAllFrontend(query);
      return this.response.fetchListSuccess(await this.transformer.transformPostList(items));
   }

   @Get(':slug')
   async findBySlug(@Param('slug') slug: string): Promise<any> {
      console.log(slug);

      const item = await this.post.findBySlug(slug);

      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformPostDetail(item));
   }
}
