import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
   UseInterceptors,
   UploadedFiles,
} from '@nestjs/common';
import { GptService } from '../services/gpt.service';
import { HelperService } from '@core/services/helper.service';
import { UserGuard } from '@common/auth/user/guards/user.guard';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ACL } from '@common/auth/decorators/acl.decorator';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { BeGptDto } from '@common/chatgpt/admin/dto/beGpt.dto';
import { Permissions } from '@core/services/permission.service';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ResponseService } from '@core/services/response.service';
import { TransformerGptService } from '../services/transformerGpt.service';
import { ActivityInterceptor } from '@core/interceptors/activity.interceptor';
import { randStr } from '@core/helpers/file';
@ApiTags('Admin/Gpt')
@Controller('admin/gpt')
@UseGuards(UserGuard)
@UseInterceptors(CoreTransformInterceptor, ActivityInterceptor)
export class BeGptController {
   constructor(
      private customerService: GptService,
      private helperService: HelperService,
      private response: ResponseService,
      private transformer: TransformerGptService,
   ) {}

   @Post('chat')
   @ACL(Permissions.chatgpt)
   @HasFile()
   @ApiExcludeEndpoint()
   async create(@Body() dto: BeGptDto): Promise<any> {
      const item = await this.customerService.chat(dto);
      if (!item.status) return this.response.createdFail();
      return this.response.createdSuccess(item);
      // return this.response.createdSuccess(await this.transformer.transformGptDetail(item));
   }
}
