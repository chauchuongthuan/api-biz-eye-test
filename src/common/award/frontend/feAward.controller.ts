import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { saveFileContent } from '@core/helpers/content';
import { AwardService } from '../services/award.service';
import { TransformerAwardService } from '../services/transformerAward.service';
@ApiTags('Frontend/award')
@Controller('award')
@UseInterceptors(CoreTransformInterceptor)
export class FeAwardController {
    constructor(
        private awardService: AwardService,
        private transformer: TransformerAwardService,
        private response: ResponseService,
    ) { }

    @Get()
    async findByPageCode(@Query() query: Record<string, any>): Promise<any> {
        const items = await this.awardService.findGroupByYear();
        return this.response.fetchListSuccess(items);
    }
}
