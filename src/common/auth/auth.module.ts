import { Module } from '@nestjs/common';
import { UserAuthModule } from './user/user.module';
import { CustomerAuthModule } from './customer/customer.module';

@Module({
   imports: [UserAuthModule, CustomerAuthModule],
   exports: [UserAuthModule, CustomerAuthModule],
})
export class AuthModule {}
