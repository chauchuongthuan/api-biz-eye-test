import { TriggerService } from '@common/customer/services/trigger.service';
import { GuardEnum } from '@core/constants/guard.enum';
import { FastJwtService } from '@core/services/fastJwt.service';
import { FbGraphService } from '@core/services/fbGraph.service';
import { HelperService } from '@core/services/helper.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '@schemas/customer/customer.schemas';
import { TokenBlacklist } from '@schemas/user/tokenBlacklist.schema';
import { FeCustomerDto } from '@src/common/customer/frontend/dto/feCustomer.dto';
import { feCustomerService } from '@src/common/customer/services/frontend/feCustomer.service';
import { AuthTypeEnum } from '@src/core/constants/auth.enum';
import { randStr } from '@src/core/helpers/file';
// import { GoogleApiService } from '@src/core/services/googleApi.service';
import { Model } from 'mongoose';
import { LoginDto } from '../dto/login.dto';
import { CustomerUpdateImage, CustomerUpdateProfile, ResendVertifyCodeDto, VertifyCodeDto } from '../dto/updateProfile.dto';
const moment = require('moment');
const sgMail = require('@sendgrid/mail');
@Injectable()
export class CustomerAuthService {
   private readonly statusCode: number;
   private injectData;
   constructor(
      @InjectModel(TokenBlacklist.name) private tokenBlacklist: Model<TokenBlacklist>,
      private customerService: feCustomerService,
      private helperService: HelperService,
      private fastJwtService: FastJwtService,
      private readonly configService: ConfigService,
      private readonly triggerService: TriggerService,
      private readonly fbGraphService: FbGraphService,
      // private readonly googleApiService: GoogleApiService,
      @Inject(REQUEST) private request: any,
   ) {
      this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      this.injectData = { shopId: this.request.shopId };
   }

   ///REGISTER
   async register(data: FeCustomerDto) {
      return this.customerService.create(data);
   }

   ///LOGIN
   async login(dto: LoginDto): Promise<any> {
      const conditions = {
         $or: [
            {
               email: dto.email,
               active: true,
            },
            {
               phone: dto.email,
               active: true,
            },
         ],
      };
      const customer = await this.customerService.findOneByConditions(conditions);
      if (!customer) return false;

      const comparedPassword = await this.helperService.compareHash(dto.password, customer.password);
      if (!comparedPassword) return false;
      const process = await Promise.all([
         this.signToken(customer),
         this.signRefreshToken(customer),
         this.triggerService.login(customer.id),
      ]);
      const [token, refreshToken, any] = process;

      return { token, refreshToken };
   }

   async loginSocial(data: { accessToken: string }, social: string): Promise<any> {
      let authType;
      let socialRes;
      if (social == 'facebook') authType = AuthTypeEnum.FACEBOOK;
      // if(social == 'google') authType = AuthTypeEnum.GOOGLE;
      if (!authType) return this.helperService.throwException('Sai hệ thống!', this.statusCode);

      if (authType == AuthTypeEnum.FACEBOOK) socialRes = await this.fbGraphService.getProfile(data.accessToken);
      // if(authType == AuthTypeEnum.GOOGLE) socialRes = await this.googleApiService.getProfile(data.accessToken);

      if (!socialRes.status) return this.helperService.throwException('Không thể đăng nhập!', this.statusCode);

      const socialProfile = socialRes.data;
      // let existAccount;

      //if facebook
      const conditions: Array<any> = [{ 'social.facebook.id': socialProfile.id }];

      //if google
      // if(authType == AuthTypeEnum.GOOGLE) conditions = [{ "social.google.id": socialProfile.id}]

      //login same email
      if (socialProfile.email) conditions.push({ email: socialProfile.email });

      //find exist account
      const existAccount = await this.customerService.findOneByConditions({ $or: conditions });
      if (existAccount && (!existAccount.active || existAccount.deletedAt))
         return this.helperService.throwException('Tài khoản đã bị khóa!', this.statusCode);

      if (existAccount) {
         const processes = await Promise.all([this.signToken(existAccount), this.signRefreshToken(existAccount)]);
         const [token, refreshToken] = processes;
         existAccount.lastLogin = new Date();
         existAccount.save();
         return { token: token, refreshToken };
      }

      const socialInfo = {};
      socialInfo[social] = {
         id: socialProfile.id,
         name: socialProfile.name,
         email: socialProfile.email,
      };

      const rs = await this.customerService.create({
         name: socialProfile.name,
         uid: socialProfile.id,
         email: socialProfile.email,
         authType: authType,
         social: socialInfo,
         gender: '',
      });

      if (!rs.status) return this.helperService.throwException('Không thể đăng ký tài khoản mới!', this.statusCode);
      //
      const processes = await Promise.all([this.signToken(rs.data), this.signRefreshToken(rs.data)]);
      const [token, refreshToken] = processes;
      // user.lastLogin = new Date;
      // user = await user.save();
      return { token: token, refreshToken };
   }

   async signToken(customer: Customer | { _id: string }): Promise<any> {
      const expireAtArr = process.env.JWT_CUSTOMER_EXPIRE.split(/(\d+)/).filter(Boolean);
      const expireAt = this.helperService.addDateTime(expireAtArr[0], expireAtArr[1]);
      const token = await this.fastJwtService.signToken(
         {
            guard: GuardEnum.CUSTOMER,
            id: customer._id,
            expireAt: expireAt,
         },
         {
            ttl: Number(this.configService.get('jwtCustomer.options.ttl')),
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),
         },
      );
      return token;
   }

   async signRefreshToken(customer: Customer | { _id: string }): Promise<any> {
      const expireAt = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
      return await this.fastJwtService.signToken(
         {
            id: customer._id,
            guard: GuardEnum.CUSTOMER,
            expireAt: expireAt,
         },
         {
            ttl: 604800000,
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),
         },
      );
   }

   async refreshToken(data: object): Promise<any> {
      let refreshToken = data['refreshToken'];
      const payload = await this.fastJwtService.verifyToken(
         refreshToken,
         GuardEnum.CUSTOMER,
         {
            ttl: 604800000,
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),
         },
         this.statusCode,
      );
      const processes = await Promise.all([
         this.customerService.detail(payload.id),
         this.signToken({ _id: payload.id }),
         this.signRefreshToken({ _id: payload.id }),
         this.existInBlacklist({ token: refreshToken, guard: GuardEnum.CUSTOMER }),
      ]);
      const customer = processes[0];
      const token = processes[1];
      const blackList = processes[3];
      if (!customer || blackList) return this.helperService.throwException('Thất bại', this.statusCode);
      await new this.tokenBlacklist({ token: refreshToken, guard: GuardEnum.CUSTOMER, expireAt: payload.expireAt }).save();
      refreshToken = processes[2];
      return { token, refreshToken: refreshToken };
   }

   async existInBlacklist(query: Record<string, any>): Promise<TokenBlacklist> {
      return this.tokenBlacklist.findOne(query);
   }

   async logout(data: { token: string; guard: string; expireAt: string; refreshToken: string }): Promise<any> {
      const refreshToken = data.refreshToken;
      const payload = await this.fastJwtService.verifyToken(refreshToken, GuardEnum.CUSTOMER, {
         ttl: parseInt(process.env.JWT_CUSTOMER_TTL),
         key: process.env.JWT_CUSTOMER_SECRET,
         algorithm: process.env.JWT_CUSTOMER_ALGORITHM,
      });
      return await Promise.all([
         new this.tokenBlacklist({ token: refreshToken, guard: GuardEnum.CUSTOMER, expireAt: payload.expireAt }).save(),
         new this.tokenBlacklist({ token: data.token, guard: GuardEnum.CUSTOMER, expireAt: data.expireAt }).save(),
      ]);
   }

   async verifyToken(token: string): Promise<any> {
      const processes = await Promise.all([
         this.tokenBlacklist.findOne({ token: token, guard: GuardEnum.CUSTOMER }),
         this.fastJwtService.verifyToken(token, GuardEnum.CUSTOMER, {
            ttl: Number(this.configService.get('jwtCustomer.options.ttl')),
            key: this.configService.get('jwtCustomer.secretKey'),
            algorithm: this.configService.get('jwtCustomer.options.algorithm'),
         }),
      ]);
      const tokenBlacklist = processes[0];
      const payload = processes[1];
      if (tokenBlacklist) return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);

      const customer = await this.customerService.detail(payload.id);
      if (!customer) return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);
      return { customer, payload };
   }

   async getProfile(customerID: string) {
      return this.customerService.detail(customerID);
   }

   async updateProfile(id: string, data: CustomerUpdateProfile) {
      return this.customerService.update(id, data, null);
   }

   async updateProfileImage(id: string, data: CustomerUpdateImage, files: any) {
      return this.customerService.updateProfileImage(id, data, files);
   }

   async forgotPassword(data: { email: string }): Promise<any> {
      const expireResetCode = moment().add(5, 'm').format('YYYY-MM-DD HH:mm:ss');
      const resetCode = randStr();
      const customer = await this.customerService.findOneByConditions({
         email: data.email,
         active: true,
         deletedAt: null,
      });
      if (!customer) return false;
      if (customer && !customer.email) return this.helperService.throwException('Tài khoản này chưa có email!', this.statusCode);
      const result = await this.customerService.update(
         customer._id,
         {
            resetCode: resetCode,
            expireResetCode: expireResetCode,
         },
         { new: true },
      );
      if (!result) return false;
      // send mail;
      this.sendEmailForgotPassword(customer.email, resetCode);
      return true;
   }

   async resetPassword(data: { resetCode: string; password: string }): Promise<Customer> {
      data.password = await this.helperService.hash(data.password);
      const customer = await this.customerService.findOneByConditions({
         resetCode: data.resetCode,
         expireResetCode: { $gte: new Date() },
      });
      if (customer)
         return this.customerService.update(
            customer.id,
            {
               token: null,
               resetCode: null,
               expireResetCode: null,
               password: data.password,
            },
            null,
         );
      return customer;
   }

   async updatePassword(data: Record<string, any>, customer: Customer) {
      const comparedPassword = await this.helperService.compareHash(data.oldPassword, customer.password);
      if (!comparedPassword) this.helperService.throwException('Old password wrong', 406);
      return this.customerService.update(customer.id, { password: data.newPassword }, null);
   }

   async vertifyCode(data: VertifyCodeDto): Promise<Customer> {
      const customer = await this.customerService.findOneByConditions({ email: data.email, vertifyCode: data.vertifyCode });
      if (customer) await this.customerService.update(customer.id, { active: true, vertifyCode: null }, null);
      return customer;
   }

   async resendVertifyCode(data: ResendVertifyCodeDto): Promise<boolean> {
      const customer = await this.customerService.findOneByConditions({ email: data.email });
      if (customer) {
         if (customer.active) {
            return false;
         } else {
            const vertifyCode = randStr();
            const item = await this.customerService.update(customer.id, { vertifyCode: vertifyCode }, null);
            if (item) {
               // this.emailService.sendVerifyEmail({ code: vertifyCode, email: customer.email, name: customer.name });
               return true;
            } else {
               return false;
            }
         }
      }
      return false;
   }

   //SEND EMAIL
   async sendEmailForgotPassword(toEmail: string, code: string): Promise<boolean> {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const email = process.env.SENDGRID_EMAIL_SEND;
      const msg = {
         to: toEmail,
         from: {
            email,
            name: process.env.SENDGRID_TEMPLATE_SEND_NAME,
         },
         templateId: process.env.SENDGRID_TEMPLATE_FORGOT_PASSWORD,
         dynamic_template_data: { frontendUrl: process.env.FRONTEND_URL, code },
      };
      try {
         sgMail.send(msg);
      } catch (error) {
         console.error(error);
         if (error.response) {
            console.error(error.response.body);
         }
      }
      return true;
   }
}
