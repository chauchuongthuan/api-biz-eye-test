import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user/user.schemas';
import { GuardEnum } from '@core/constants/guard.enum';
import { FastJwtService } from '@core/services/fastJwt.service';
import { HelperService } from '@core/services/helper.service';
import { UserService } from '@common/users/services/user.service';
import { TokenBlacklist } from '@schemas/user/tokenBlacklist.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAuthService {
   constructor(
      @InjectModel(TokenBlacklist.name) private tokenBlacklist: Model<TokenBlacklist>,
      private usersService: UserService,
      private helperService: HelperService,
      private fastJwtService: FastJwtService,
      private readonly configService: ConfigService,
   ) {}

   async firstAdmin(): Promise<User> {
      return this.usersService.firstAdmin();
   }

   async isAdmin(token: string): Promise<boolean> {
      const user = await this.verifyToken(token);
      if (!user) return false;
      const userCreated = await this.usersService.detail(user.user.id);
      return !userCreated ? false : userCreated.role.isAdmin;
   }

   async login(data: object): Promise<any> {
      const email = data['email'];
      const password = data['password'];
      const item = await this.usersService.findOne({ email: email, active: true });
      if (!item) return false;
      const processes = await Promise.all([this.helperService.compareHash(password, item.password), this.signToken(item)]);
      if (!processes[0]) return false;
      item.token = processes[1];
      return item;
   }

   async logout(data: { token: string; guard: string; expireAt: string }): Promise<any> {
      return new this.tokenBlacklist(data).save();
   }

   async getProfile(id: string): Promise<any> {
      return this.usersService.findOne({ _id: id, active: true });
   }

   async postProfile(id: string, data: object, files: Record<any, any>): Promise<any> {
      let comparedResult = true;
      const password = data['password'];
      const currentPassword = data['currentPassword'];
      const item = await this.usersService.findOne({ _id: id, active: true });
      if (typeof password != 'undefined' && typeof currentPassword == 'undefined')
         return this.helperService.throwException('The current password is in-correct.');
      if (typeof password != 'undefined') comparedResult = await this.helperService.compareHash(currentPassword, item.password);
      if (!comparedResult) return this.helperService.throwException('The current password is in-correct.');
      return this.usersService.update(id, data, files);
   }

   async verifyToken(token: string): Promise<any> {
      const processes = await Promise.all([
         this.tokenBlacklist.findOne({ token: token, guard: GuardEnum.USER }),
         this.fastJwtService.verifyToken(token, GuardEnum.USER, {
            ttl: Number(process.env.JWT_USER_TTL),
            key: process.env.JWT_USER_SECRET,
            algorithm: process.env.JWT_USER_ALGORITHM,
         }),
      ]);
      const tokenBlacklist = processes[0];
      const payload = processes[1];
      if (tokenBlacklist) return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);
      const user = await this.usersService.findOne({ _id: payload.id, active: true });
      if (!user) return this.helperService.throwException('Token is in-valid', HttpStatus.FORBIDDEN);
      return { user, payload };
   }

   private async signToken(user: User): Promise<any> {
      const expireAtArr = this.configService.get('JWT_USER_EXPIRE').split(/(\d+)/).filter(Boolean);
      const expireAt = this.helperService.addDateTime(expireAtArr[0], expireAtArr[1]);
      const token = await this.fastJwtService.signToken(
         {
            guard: GuardEnum.USER,
            id: user._id,
            expireAt: expireAt,
         },
         {
            ttl: Number(process.env.JWT_USER_TTL),
            key: process.env.JWT_USER_SECRET,
            algorithm: process.env.JWT_USER_ALGORITHM,
         },
      );
      return token;
   }
}
