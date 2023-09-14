import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserGuard } from '@common/auth/user/guards/user.guard';

export const UserSecure = (): any => {
   return applyDecorators(UseGuards(UserGuard), ApiBearerAuth(), ApiUnauthorizedResponse({ description: 'Unauthorized' }));
};
