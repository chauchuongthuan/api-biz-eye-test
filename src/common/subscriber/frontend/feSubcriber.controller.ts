import {
   Body,
   Controller,
   Get,
   Post,
   Put,
   Request,
   UseInterceptors,
   UploadedFiles,
   Param,
   Query,
   HttpStatus,
   Delete,
} from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { FeSubscriberDto } from '../dto/feSubscriber.dto';
import { SubscriberService } from '../services/subscriber.service';
import { TransformerSubscriberService } from '../services/transformerSubscriber.service';

@ApiTags('Subscriber')
@Controller('subscribers')
@UseInterceptors(CoreTransformInterceptor)
export class FeSubscriberController {
   constructor(
      private subscribeService: SubscriberService,
      private response: ResponseService,
      private transformer: TransformerSubscriberService,
   ) {}

   @Post()
   async register(@Body() dto: FeSubscriberDto): Promise<any> {
      let subscribe = await this.subscribeService.register(dto);
      if (!subscribe) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformSubscriberDetail(subscribe));
   }
}
