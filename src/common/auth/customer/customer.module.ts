import { Module } from '@nestjs/common';
import { CustomerModule } from '@common/customer/customer.module';
import { SchemasModule } from '@schemas/schemas.module';
import { AuthController } from './controllers/auth.controller';
import { CustomerAuthService } from './services/auth.service';
import { FbGraphService } from '@core/services/fbGraph.service';

@Module({
   imports: [CustomerModule, SchemasModule],
   controllers: [AuthController],
   providers: [CustomerAuthService, FbGraphService],
   exports: [CustomerAuthService, FbGraphService],
})
export class CustomerAuthModule {}
