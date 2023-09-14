import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from '@schemas/activities/activity.schema';
import { ActivityDto } from '@common/activities/admin/dtos';
import { PaginateModel } from 'mongoose';
import { isNotEmpty } from 'class-validator';
import { User } from '@src/schemas/user/user.schemas';
import { HelperService } from '@src/core/services/helper.service';
const moment = require('moment');
@Injectable()
export class ActivityService {
   constructor(
      @InjectModel(Activity.name) private activity: PaginateModel<Activity>,
      @InjectModel(User.name) private user: PaginateModel<User>,
      private helperService: HelperService,
   ) {}

   async findAll(query: Record<string, any>): Promise<any> {
      const conditions = {};
      const sort = Object();
      sort[query.orderBy] = query.order;
      const projection = {};

      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
      }

      if (isNotEmpty(query['message'])) {
         conditions['message_vi'] = {
            $regex: new RegExp(query['message'], 'img'),
         };
      }

      if (isNotEmpty(query['message_en'])) {
         conditions['message_en'] = {
            $regex: new RegExp(query['message_en'], 'img'),
         };
      }

      if (isNotEmpty(query['userName'])) {
         const nameNon = this.helperService.removeSignVietnamese(query['userName']);
         const users = await this.user.find({ name: new RegExp(nameNon, 'img') }).select(['_id']);
         const userIds = users.map((item) => {
            return item._id;
         });

         conditions['user'] = {
            $in: userIds,
         };
      }

      if (isNotEmpty(query.createdFrom) || isNotEmpty(query.createdTo)) {
         const createdFrom = moment(query.createdFrom || '1000-01-01').startOf('day');
         const createdTo = moment(query.createdTo || '3000-01-01').endOf('day');
         conditions[`createdAt`] = {
            $gte: createdFrom,
            $lte: createdTo,
         };
      }
      if (isNotEmpty(query.get)) {
         const get = parseInt(query.get);
         const result = this.activity.find(conditions).sort(sort).select(projection).populate('user');
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.activity.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
            populate: 'user',
         });
      }
   }

   async create(activityDto: ActivityDto): Promise<boolean> {
      await new this.activity(activityDto).save();
      return true;
   }
}
