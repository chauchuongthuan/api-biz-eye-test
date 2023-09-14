import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BeCustomerCareTypeController } from './admin/beCustomerCareType.controller';
import { CustomerCareTypeService } from './services/customerCareType.service';
import { TransformerCustomerCareService } from './services/transformerCustomerCare.service';
import { BeCustomerCareListController } from './admin/beCustomerCareList.controller';
import { CustomerCareListService } from './services/customerCareList.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeCustomerCareTypeController, BeCustomerCareListController],
   providers: [CustomerCareTypeService, CustomerCareListService, TransformerCustomerCareService],
   exports: [CustomerCareTypeService, CustomerCareListService, TransformerCustomerCareService],
})
export class CustomerCareModule {}
