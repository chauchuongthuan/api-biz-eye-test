import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ResponseService } from '@core/services/response.service';
import { ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { saveFileContent } from '@core/helpers/content';
import { TransformerExpertiseService } from '../services/transformerCategory.service';
import { DefaultListQuery } from '@core/decorators/defaultListQuery.decorator';
import { ExpertiseService } from '../services/expertise.service';

@ApiTags('Frontend/expertise')
@Controller('expertise')
@UseInterceptors(CoreTransformInterceptor)
export class FeExpertiseController {
    constructor(
        private expertiseService: ExpertiseService,
        private transformer: TransformerExpertiseService,
        private response: ResponseService,
    ) { }

    @Get()
    @DefaultListQuery()
    async getAll(@Query() query: Record<string, any>): Promise<any> {
        const items = await this.expertiseService.findAll(query);
        return this.response.fetchListSuccess(await this.transformer.transformExpertiseList(items));
    }
}
