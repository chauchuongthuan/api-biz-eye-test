import { Module } from '@nestjs/common';
import { SchemasModule } from '@schemas/schemas.module';
import { TransformerCustomerService } from './services/transformerCustomer.service';
import { CustomerService } from './services/backend/customer.service';
import { BeCustomerController } from './admin/beCustomer.controller';
import { FeCustomerController } from './frontend/feCustomer.controller';
import { ActivityModule } from '@common/activities/activity.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TriggerService } from './services/trigger.service';
import { feCustomerService } from './services/frontend/feCustomer.service';
import { CustomerAuthService } from '../auth/customer/services/auth.service';

@Module({
   imports: [SchemasModule, ActivityModule, EventEmitterModule.forRoot()],
   controllers: [BeCustomerController, FeCustomerController],
   providers: [CustomerService, feCustomerService, TransformerCustomerService, TriggerService, CustomerAuthService],
   exports: [CustomerService, feCustomerService, TransformerCustomerService, TriggerService, CustomerAuthService],
})
export class CustomerModule {}
