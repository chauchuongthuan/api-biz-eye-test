import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CustomerGuard } from '@common/auth/customer/guards/customer.guard';

export const CustomerSecure = (): any => {
   return applyDecorators(UseGuards(CustomerGuard), ApiBearerAuth(), ApiUnauthorizedResponse({ description: 'Unauthorized' }));
};
