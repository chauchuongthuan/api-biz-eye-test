import { Body, Controller, Get, Param, Put, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { BePageDto } from '../dto/bePage.dto';
import { PageService } from '../services/page.service';
import { TransformerPageService } from '../services/transformerPage.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { saveFileContent } from '@core/helpers/content';
import { Permissions } from '@core/services/permission.service';
@ApiTags('Admin/Page')
@Controller('admin/pages')
@UseInterceptors(CoreTransformInterceptor)
@UserSecure()
export class BePageController {
   constructor(private page: PageService, private transformer: TransformerPageService, private response: ResponseService) {}

   @Get()
   @ACL(Permissions.page_list)
   @ApiExcludeEndpoint()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.page.findAll(query);
      return this.response.fetchListSuccess(await this.transformer.transformPageList(items));
   }

   @Get(':id')
   @ACL(Permissions.page_detail)
   @ApiExcludeEndpoint()
   async findById(@Param('id') id: string): Promise<any> {
      const item = await this.page.findById(id);
      if (!item) return this.response.detailFail();
      await saveFileContent('content', item, 'pages', false);
      return this.response.detailSuccess(await this.transformer.transformPageDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.page_edit)
   @HasFile()
   @ApiExcludeEndpoint()
   async edit(@UploadedFiles() files, @Param('id') id: string, @Body() dto: any): Promise<any> {
      const item = await this.page.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformPageDetail(item));
   }
}
