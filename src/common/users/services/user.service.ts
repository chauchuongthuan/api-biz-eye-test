import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { User } from '@schemas/user/user.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';
const moment = require('moment');
@Injectable()
export class UserService {
   constructor(@InjectModel(User.name) private user: PaginateModel<User>, private helperService: HelperService) {}

   async totalUser(): Promise<any> {
      return this.user.countDocuments();
   }

   async totalInActiveUser(): Promise<any> {
      return this.user.countDocuments({ active: false });
   }

   async findAll(query: Record<string, any>): Promise<any> {
      const conditions = {};
      conditions['deletedAt'] = null;
      const sort = Object();
      sort[query.orderBy] = query.order;

      const projection = {};

      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
      }

      if (isNotEmpty(query.name)) {
         const nameNon = this.helperService.nonAccentVietnamese(query.name);
         conditions['nameNon'] = {
            $regex: new RegExp(nameNon, 'img'),
         };
      }
      if (isNotEmpty(query.nameNon)) {
         conditions['nameNon'] = {
            $regex: new RegExp(query.nameNon, 'img'),
         };
      }

      if (isNotEmpty(query.email)) {
         conditions['email'] = {
            $regex: new RegExp(query.email, 'img'),
         };
      }

      if (isNotEmpty(query.role)) {
         conditions['role'] = {
            $eq: query.role,
         };
      }

      if (isIn(query['active'], [true, false, 'true', 'false'])) {
         conditions['active'] = query['active'];
      }

      if (isNotEmpty(query.idNotIn)) {
         conditions['_id'] = {
            $nin: query.idNotIn,
         };
      }

      if (isNotEmpty(query.idIn)) {
         conditions['_id'] = {
            $in: query.idIn,
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
         const result = this.user.find(conditions).sort(sort).select(projection).populate('role');
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.user.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
            populate: 'role',
         });
      }
   }

   async firstAdmin(): Promise<User> {
      const result = await this.user.aggregate([
         {
            $lookup: {
               from: 'roles',
               localField: 'role',
               foreignField: '_id',
               as: 'role',
            },
         },
         { $unwind: '$role' },
         { $match: { 'role.isAdmin': true } },
      ]);

      return result.length ? result[0] : null;
   }

   async findOne(query: Record<string, any>): Promise<User> {
      return this.user.findOne(query).populate('role');
   }

   async create(data: object, files: Record<any, any>): Promise<User> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      data['password'] = await this.helperService.hash(data['password']);
      await convertContentFileDto(data, files, ['profileImage']);
      const item = await new this.user(data).save();
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: object, files: Record<any, any>): Promise<User> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      if (typeof data['password'] != 'undefined') data['password'] = await this.helperService.hash(data['password']);
      await convertContentFileDto(data, files, ['profileImage']);
      const item = await this.user.findByIdAndUpdate(id, data, { new: true }).populate('role');
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async detail(id: string): Promise<User> {
      return this.user.findById(id).populate('role');
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.user.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }
}
