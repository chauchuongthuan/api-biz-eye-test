import { ACL } from '@common/auth/decorators/acl.decorator';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HelperService } from '@core/services/helper.service';
import { Permissions } from '@core/services/permission.service';
import { ResponseService } from '@core/services/response.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BeUserDto } from '../dto/beUser.dto';
import { TransformerUserService } from '../services/transformerUser.service';
import { UserService } from '../services/user.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';

@ApiTags('Admin/User')
@Controller('admin/users')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class UserController {
   constructor(
      private userService: UserService,
      private helperService: HelperService,
      private transformer: TransformerUserService,
      private response: ResponseService,
   ) {}

   @Get()
   @DefaultListQuery()
   @ACL(Permissions.user_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.userService.findAll(query);
      if (query.get && query.export) return this.transformer.transformUserExport(items);
      return this.response.fetchListSuccess(await this.transformer.transformUserList(items));
   }

   @Get('total-user')
   @ACL(Permissions.user_list)
   async totalUser(@Query() query: Record<string, any>): Promise<any> {
      let items = await this.userService.totalUser();
      if (!items) {
         items = 0;
      }
      return this.response.fetchListSuccess(items);
   }

   @Get(':id')
   @ACL(Permissions.user_detail)
   async detail(@Param('id') id: string): Promise<any> {
      const item = (await this.userService.detail(id)) as any;
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformUserDetail(item));
   }

   @Post()
   @ACL(Permissions.user_add)
   @HasFile()
   async create(@UploadedFiles() files: Record<any, any>, @Body() dto: BeUserDto): Promise<any> {
      const item = await this.userService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformUserDetail(item));
   }

   @Put(':id')
   @ACL(Permissions.user_edit)
   @HasFile()
   async update(@UploadedFiles() files: Record<any, any>, @Param('id') id: string, @Body() dto: BeUserDto): Promise<any> {
      const item = await this.userService.update(id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformUserDetail(item));
   }

   @Delete()
   @ACL(Permissions.user_delete)
   async deletes(@Body('ids') ids: Array<string>): Promise<any> {
      const item = await this.userService.deletes(ids);
      if (!item) return this.response.deletedFail();
      return this.response.deletedSuccess();
   }
}
