import { TransformerCustomerService } from '@common/customer/services/transformerCustomer.service';
import { CoreResponse } from '@core/interfaces/coreResponse.interface';
import { ResponseService } from '@core/services/response.service';
import { Body, Controller, Get, Param, Post, Put, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeCustomerDto } from '@src/common/customer/frontend/dto/feCustomer.dto';
import { HasFile } from '@src/core/decorators/hasFile.decorator';
import { CoreTransformInterceptor } from '@src/core/interceptors/coreTransform.interceptor';
import { Customer } from '@src/schemas/customer/customer.schemas';
import { CustomerAuth } from '../decorators/customer.decorator';
import { CustomerSecure } from '../decorators/customerSecure.decorator';
import { LoginSocialDto } from '../dto/customer.loginSocial.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import {
   ChangePasswordCustomerDto,
   CustomerUpdateImage,
   CustomerUpdatePass,
   CustomerUpdateProfile,
   ForgotPasswordDto,
   ResendVertifyCodeDto,
   VertifyCodeDto,
} from '../dto/updateProfile.dto';
import { CustomerAuthService } from '../services/auth.service';
@ApiTags('Auth/Customer')
@Controller('auth/customers')
@UseInterceptors(CoreTransformInterceptor)
export class AuthController {
   constructor(
      private authService: CustomerAuthService,
      private transformer: TransformerCustomerService,
      private response: ResponseService,
   ) {}

   @Post('register')
   async registry(@Body() dto: FeCustomerDto): Promise<any> {
      const rs = await this.authService.register(dto);
      if (!rs.status) return this.response.createdFail(rs.message);
      const [token, refreshToken] = await Promise.all([
         this.authService.signToken(rs.data),
         this.authService.signRefreshToken(rs.data),
      ]);
      return this.response.createdSuccess({ token, refreshToken });
   }

   @Post('login')
   async login(@Body() dto: LoginDto): Promise<CoreResponse> {
      const login = await this.authService.login(dto);
      if (!login) return this.response.credentialFail('Thông tin đăng nhập không đúng!');
      return this.response.detailSuccess(login);
   }

   @Post('login/:social')
   async loginSocial(@Body() dto: LoginSocialDto, @Param('social') social: string): Promise<CoreResponse> {
      const login = await this.authService.loginSocial(dto, social);
      if (!login) return this.response.credentialFail('Thông tin đăng nhập không đúng!');
      return this.response.detailSuccess(login);
   }

   @Post('logout')
   @CustomerSecure()
   async logout(@Request() req: Record<string, any>, @Body('refreshToken') refreshToken: string): Promise<any> {
      const logout = await this.authService.logout({
         token: req.tokenAuth,
         guard: req.guardAuth,
         expireAt: req.expireAtAuth,
         refreshToken,
      });
      if (!logout) return this.response.credentialFail();
      return this.response.detailSuccess();
   }

   @Put('refresh')
   async refreshToken(@Body() dto: RefreshTokenDto): Promise<CoreResponse> {
      const refreshToken = await this.authService.refreshToken(dto);
      if (!refreshToken) return this.response.updatedFail();
      return this.response.detailSuccess({ token: refreshToken.token, refreshToken: refreshToken.refreshToken });
   }

   @Get('profiles')
   @CustomerSecure()
   async getProfile(@CustomerAuth() customer: Record<string, any>): Promise<CoreResponse> {
      const item = await this.authService.getProfile(customer.id);
      if (!item) return this.response.detailFail();
      return this.response.detailSuccess(await this.transformer.transformCustomerDetail(item));
   }

   @Put('profiles')
   @CustomerSecure()
   async updateProfile(@Body() dto: CustomerUpdateProfile, @CustomerAuth() customer: Customer): Promise<CoreResponse> {
      const item = await this.authService.updateProfile(customer.id, dto);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerDetail(item));
   }

   @Put('profiles/change-profile-image')
   @CustomerSecure()
   @HasFile()
   async updateProfileImage(
      @UploadedFiles() files: Record<any, any>,
      @Body() dto: CustomerUpdateImage,
      @CustomerAuth() customer: Customer,
   ): Promise<CoreResponse> {
      const item = await this.authService.updateProfileImage(customer.id, dto, files);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess(await this.transformer.transformCustomerDetail(item));
   }

   @Put('update-password')
   @CustomerSecure()
   async updatePassword(@Body() dto: CustomerUpdatePass, @CustomerAuth() customer: Customer) {
      const item = await this.authService.updatePassword(dto, customer);
      if (!item) return this.response.updatedFail();
      return this.response.updatedSuccess('Change password successfully');
   }

   @Put('change-password')
   async changePassword(@Body() dto: ChangePasswordCustomerDto) {
      const resetPassword = await this.authService.resetPassword({ resetCode: dto.code, password: dto.newPassword });
      if (!resetPassword) return this.response.updatedFail('Đổi mật khẩu thất bại!');
      return this.response.updatedSuccess(null, 'Đổi mật khẩu thành công!');
   }

   @Post('forgot-password')
   async forgotPassword(@Body() dto: ForgotPasswordDto) {
      const forgotPassword = await this.authService.forgotPassword(dto);
      if (!forgotPassword) return this.response.detailFail('Thông tin sai!');
      return this.response.detailSuccess(null, 'Đã gửi mã code');
   }

   @Post('vertify-code')
   async vertifyCode(@Body() dto: VertifyCodeDto) {
      const vertify = await this.authService.vertifyCode(dto);
      if (!vertify) return this.response.detailFail('Thông tin sai!');
      return this.response.detailSuccess('Kích hoạt tài khoản thành công!');
   }

   @Post('resend-vertify-code')
   async resendVertifyCode(@Body() dto: ResendVertifyCodeDto) {
      const vertify = await this.authService.resendVertifyCode(dto);
      if (!vertify) return this.response.detailFail('Email chưa được đăng ký!');
      return this.response.detailSuccess('Gửi lại mã xác thực thành công!');
   }
}
