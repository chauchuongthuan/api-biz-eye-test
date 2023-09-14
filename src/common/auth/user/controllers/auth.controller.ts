import { TransformerUserService } from '@common/users/services/transformerUser.service';
import { HasFile } from '@core/decorators/hasFile.decorator';
import { ResponseService } from '@core/services/response.service';
import { Body, Controller, Get, Post, Put, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@schemas/user/user.schemas';
import { CoreTransformInterceptor } from '@src/core/interceptors/coreTransform.interceptor';
import { UserAuth } from '../decorators/user.decorator';
import { LoginDto } from '../dto/login.dto';
import { ProfileDto } from '../dto/profile.dto';
import { UserAuthService } from '../services/auth.service';

@ApiTags('Auth/User')
@Controller('auth/users')
@UseInterceptors(CoreTransformInterceptor)
export class AuthController {
   constructor(
      private authService: UserAuthService,
      private transformer: TransformerUserService,
      private response: ResponseService,
   ) {}

   @Post('login')
   @ApiBearerAuth()
   async login(@Body() dto: LoginDto): Promise<any> {
      const login = await this.authService.login(dto);
      if (!login) return this.response.credentialFail();
      return this.response.detailSuccess(await this.transformer.transformUserDetail(login, { token: login.token }));
   }

   @Post('logout')
   @ApiBearerAuth()
   async logout(@Request() req: Record<string, any>): Promise<any> {
      const token = req.headers.authorization.split(' ')[1];
      const data = await this.authService.verifyToken(token);
      const logout = await this.authService.logout({
         token,
         guard: data.payload.guard,
         expireAt: data.payload.expireAt,
      });
      if (!logout) return this.response.credentialFail();
      return this.response.detailSuccess();
   }

   @Get('profiles')
   @ApiBearerAuth()
   async getProfile(@UserAuth() user: User): Promise<any> {
      const profile = await this.authService.getProfile(user.id);
      if (!profile) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformUserDetail(profile));
   }

   @Put('profiles')
   @HasFile()
   @ApiBearerAuth()
   async postProfile(@UploadedFiles() files: Record<any, any>, @Body() dto: ProfileDto, @UserAuth() user: User): Promise<any> {
      const profile = await this.authService.postProfile(user.id, dto, files);
      if (!profile) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformUserDetail(profile));
   }
}
