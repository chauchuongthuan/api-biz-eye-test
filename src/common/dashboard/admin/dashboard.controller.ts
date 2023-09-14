import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { HelperService } from '@core/services/helper.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserSecure } from '@src/common/auth/user/decorators/userSecure.decorator';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { Permissions } from '@core/services/permission.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { DashboardService } from '../services/dashboard.service';
@ApiTags('Admin/Dashboard')
@Controller('admin/dashboard')
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
@UserSecure()
export class DashboardController {
   constructor(private dashboardService: DashboardService, private response: ResponseService) {}

   @Get('statistical')
   @ACL(Permissions.dashboard_list)
   async statistical(): Promise<any> {
      return this.response.detailSuccess({ docs: await this.dashboardService.statistical() });
   }

   @Get('statistical-device')
   @ACL(Permissions.dashboard_list)
   async statisticalDevice(): Promise<any> {
      return this.response.detailSuccess({ docs: await this.dashboardService.statisticalDevice() });
   }

   @Get('statistical-country')
   @ACL(Permissions.dashboard_list)
   async statisticalCountry(): Promise<any> {
      return this.response.detailSuccess({ docs: await this.dashboardService.statisticalCountry() });
   }

   @Get('statistical-new-user')
   @ACL(Permissions.dashboard_list)
   async statisticalNewUser(): Promise<any> {
      return this.response.detailSuccess({ docs: await this.dashboardService.statisticalNewUser() });
   }

   @Get('statistical-favorite-post')
   @ACL(Permissions.dashboard_list)
   async statisticalFavoritePost(): Promise<any> {
      return this.response.detailSuccess({ docs: await this.dashboardService.statisticalFavoritePost() });
   }
}
