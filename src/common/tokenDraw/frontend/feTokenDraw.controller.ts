import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HelperService } from '@core/services/helper.service';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { TransformerTokenDrawService } from '../services/transformertokenDraw.service';
import { TokenDrawService } from '../services/tokenDraw.service';
import { BeUserDto } from '@src/common/users/dto/beUser.dto';
@ApiTags('Frontend/Lucky Draw')
@Controller('lucky-draw')
@UseInterceptors(CoreTransformInterceptor)
export class FeTokenDrawController {
   constructor(
      private tokenDrawServer: TokenDrawService,
      private helperService: HelperService,
      private responseService: ResponseService,
      private transformerTokenDrawService: TransformerTokenDrawService,
   ) {}

   @Post('start')
   async create(): Promise<any> {
      const item = await this.tokenDrawServer.startGame();
      if (!item) return this.responseService.createdFail();
      return this.responseService.createdSuccess(item);
   }
}
