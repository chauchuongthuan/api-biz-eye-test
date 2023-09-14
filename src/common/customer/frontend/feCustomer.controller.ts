import {
   Body,
   Controller,
   Get,
   Post,
   Put,
   Delete,
   Request,
   UseInterceptors,
   UploadedFiles,
   Param,
   Query,
   UseGuards,
} from '@nestjs/common';
import { HelperService } from '@core/services/helper.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '@src/common/customer/services/backend/customer.service';
// import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ResponseService } from '@core/services/response.service';
import { TransformerCustomerService } from '../services/transformerCustomer.service';
import { ApiBody, ApiHeader } from '@nestjs/swagger';
import { FeCustomerDto } from './dto/feCustomer.dto';
@ApiTags('Customer')
@Controller('customer')

// @UseInterceptors(CoreTransformInterceptor)
export class FeCustomerController {
   constructor(
      private customerService: CustomerService,
      private helperService: HelperService,
      private response: ResponseService,
      private transformer: TransformerCustomerService,
   ) {}

   @Get(':id')
   async getById(@Param('id') id: string): Promise<any> {
      const customer = await this.customerService.detail(id);
      if (!customer) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCustomerDetail(customer));
   }
   @Post()
   @ApiBody({ type: FeCustomerDto })
   async create(@Body() dto: FeCustomerDto, @UploadedFiles() files: Record<any, any>): Promise<any> {
      // if(dto.agency.length<8){
      //     return this.response.createdFail('Mã đại lý ít nhất 8 ký tự');
      // }
      const item = await this.customerService.create(dto, files);
      if (!item) return this.response.createdFail();
      return this.response.createdSuccess(await this.transformer.transformCustomerDetail(item));
   }
}
