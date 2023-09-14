import { Injectable, Req } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@src/schemas/user/user.schemas';
import { Post } from '@src/schemas/posts/post.schemas';
import { StatusEnum } from '@src/core/constants/post.enum';
import { Setting } from '@src/schemas/setting.schemas';

const moment = require('moment');
@Injectable()
export class DashboardService {
   constructor(
      @InjectModel(User.name) private user: PaginateModel<User>,
      @InjectModel(Post.name) private post: PaginateModel<Post>,
      @InjectModel(Setting.name) private setting: PaginateModel<Setting>, // @Req() req: Request,
   ) {}
   async statistical(): Promise<any> {
      let rs = await Promise.all([
         this.post.countDocuments({ deletedAt: null }),
         this.post.countDocuments({ deletedAt: null, status: StatusEnum.IN_REVIEW }),
         this.post.countDocuments({ deletedAt: null, status: StatusEnum.PUBLISHED }),
         this.user.countDocuments({ deletedAt: null }),
         (await this.setting.findOne({ name: 'access' })).value,
         (await this.setting.findOne({ name: 'accessByMonth' })).value,
      ]);

      return {
         totalPost: rs[0],
         totalReviewPost: rs[1],
         totalPublishedPost: rs[2],
         totalUser: rs[3],
         access: rs[4],
         accessByMonth: rs[5],
      };
   }

   async statisticalDevice(): Promise<any> {
      let rs = await Promise.all([
         (await this.setting.findOne({ name: 'accessByMobile' })).value,
         (await this.setting.findOne({ name: 'accessByWindow' })).value,
      ]);
      return {
         accessByMobile: rs[0],
         accessByWindow: rs[1],
      };
   }

   async statisticalCountry(): Promise<any> {
      let rs = await Promise.all([await this.setting.find({ name: { $regex: new RegExp('accessByCountry', 'img') } })]);
      return {
         accessByCountry: rs[0],
      };
   }

   async statisticalNewUser(): Promise<any> {
      const now = new Date();
      const month = now.getMonth();
      let rs = await Promise.all([await this.user.find({ createdAt: { $gte: month } })]);
      return {
         newUser: rs[0],
      };
   }

   async statisticalFavoritePost(): Promise<any> {
      let rs = await Promise.all([
         await this.post
            .find({ view: { $gt: 0 } })
            .sort({ view: -1 })
            .limit(10),
      ]);
      return {
         favoritePost: rs[0],
      };
   }
}
