import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { Permissions } from '@core/services/permission.service';
import { ActivityService } from '../services/activity.service';
import { ResponseService } from '@core/services/response.service';
import { UserSecure } from '@common/auth/user/decorators/userSecure.decorator';

@ApiTags('Admin/Activity')
@Controller('admin/activities')
@UserSecure()
@UseInterceptors(CoreTransformInterceptor)
export class ActivityController {
   constructor(private readonly activityService: ActivityService, private readonly responseService: ResponseService) {}

   @ApiBearerAuth()
   @Get()
   @ACL(Permissions.activity_list)
   async findAll(@Query() query: Record<string, any>): Promise<any> {
      const items = await this.activityService.findAll(query);
      return this.responseService.fetchListSuccess(items);
   }
}
