import { ACL } from '@common/auth/decorators/acl.decorator';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { Permissions } from '@core/services/permission.service';
import { ResponseService } from '@core/services/response.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { TokenDrawService } from '../services/tokenDraw.service';
import { TransformerTokenDrawService } from '../services/transformertokenDraw.service';
import { BeTokenDrawDto } from '../dto/beTokenDraw.dto';

@ApiTags('Admin/Tokens')
@Controller('admin/tokens')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class TokensDrawController {
   constructor(
      private tokenDrawService: TokenDrawService,
      private transformer: TransformerTokenDrawService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.tokenDrawService.findAll(query);
      if (query.get && query.export) return this.transformer.transformUserExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformTokenDrawList(items));
   }

   @Post('import')
   @HasFile()
   async importTokenDraw(@UploadedFiles() files: Record<any, any>): Promise<any> {
      console.log(files);
      const importFile = await this.tokenDrawService.import(files[0]);
      return this.response.createdSuccess({}, `Đợi ${importFile} giây`);
   }

   @Post()
   async create(@Body() dto: BeTokenDrawDto): Promise<any> {
      const item = await this.tokenDrawService.create(dto);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformTokenDrawDetail(item));
   }

   @Put(':id')
   async update(@Param('id') id: string, @Body() dto: BeTokenDrawDto): Promise<any> {
      const item = await this.tokenDrawService.update(id, dto);
      console.log(item);
      if (!item) return this.response.updatedFail('Token is exist');
      return this.response.updatedSuccess(await this.transformer.transformTokenDrawDetail(item));
   }

   @Delete()
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.tokenDrawService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }

   @Post('reset-all')
   async resetAll(): Promise<any> {
      const item = await this.tokenDrawService.updatesAll();
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess();
   }

   @Post('reset')
   async reset(@Body('id') id: string): Promise<any> {
      const item = await this.tokenDrawService.updates(id);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess();
   }
}
