import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HelperService } from '@src/core/services/helper.service';
import { Notification } from '@src/schemas/notification.schema';
import { Seen } from '@src/schemas/seens.schema';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
const moment = require('moment');
@Injectable()
export class NotificationsService {
   constructor(
      @InjectModel(Notification.name) private notification: PaginateModel<Notification>,
      @InjectModel(Seen.name) private seenModel: PaginateModel<Seen>,
      private readonly helperService: HelperService,
   ) {}

   async findAll(query: { page: number; limit: number; type?: number; seen?: boolean }, shopId: string, user): Promise<any> {
      let conditions = {};
      let sort = Object();
      sort['createdAt'] = '-1';
      if (isNotEmpty(query.type)) {
         conditions['type'] = query.type;
      }
      if (isNotEmpty(query.seen)) {
         // conditions['seen'] = query.seen
         let seens = await this.seenModel.find({ user });
         let listId = seens.map((item) => item.notification);
         if (query.seen) {
            conditions['_id'] = {
               $in: listId,
            };
         } else {
            conditions['_id'] = {
               $nin: listId,
            };
         }
      }
      let items = await this.notification
         .find(conditions)
         .skip((query.page - 1) * query.limit)
         .limit(query.limit)
         .sort(sort);
      return items;
   }

   async create(data: Object): Promise<any> {
      return new this.notification(data).save();
   }

   async seen(id: string, user): Promise<any> {
      let notification = await this.notification.findOne({ _id: id });
      if (!notification) this.helperService.throwException('Thông báo không tồn tại');
      let seenExist = await this.seenModel.findOne({ notification: id, user });
      if (seenExist) return notification;
      await new this.seenModel({ notification: id, user }).save();
      return notification;
   }
}
