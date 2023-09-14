import { Body, Controller, Get, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HelperService } from '@core/services/helper.service';
import { SettingService } from '../services/setting.service';
import { TransformerSettingService } from '../services/transformerSetting.service';
import { ResponseService } from '@core/services/response.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { Permissions } from '@core/services/permission.service';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { CoreTransformInterceptor } from '@src/core/interceptors/coreTransform.interceptor';
@ApiTags('Admin/Setting')
@Controller('admin/setting')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor)
export class BeSettingController {
   constructor(
      private settingService: SettingService,
      private helperService: HelperService,
      private responseService: ResponseService,
      private transformerSettingService: TransformerSettingService,
   ) {}

   @Get()
   @ACL(Permissions.setting_list)
   @ApiExcludeEndpoint()
   async findAll(): Promise<any> {
      const items = await this.settingService.findAll();
      return this.responseService.fetchListSuccess(await this.transformerSettingService.transformSettingList(items));
   }

   @Post()
   @ACL(Permissions.setting_update)
   @HasFile()
   @ApiExcludeEndpoint()
   async post(@UploadedFiles() files, @Body() body: any): Promise<any> {
      return true;
   }

   @Put()
   @ACL(Permissions.setting_update)
   @HasFile()
   @ApiExcludeEndpoint()
   async add(@UploadedFiles() files, @Body() body: any): Promise<any> {
      const items = await this.settingService.update(body, files);
      return this.responseService.updatedSuccess(await this.transformerSettingService.transformSettingList(items));
   }
}
