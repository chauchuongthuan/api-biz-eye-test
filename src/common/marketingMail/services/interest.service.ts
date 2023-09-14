import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { Interest } from '@src/schemas/marketing/interest.schema';
import { HelperService } from '@src/core/services/helper.service';
const moment = require('moment');
@Injectable()
export class InterestService {
   private locale;

   constructor(
      @InjectModel(Interest.name) private interest: PaginateModel<Interest>,
      @Inject(REQUEST) private request: any,
      private helper: HelperService,
   ) {
      this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
   }

   async totalInterest(): Promise<any> {
      return this.interest.countDocuments();
   }

   async findAll(query: Record<string, any>): Promise<any> {
      const locale = this.locale;
      const conditions = {};
      const sort = Object();
      sort[query.orderBy] = query.order;
      conditions['deletedAt'] = null;

      const projection = {};

      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
      }

      if (isNotEmpty(query.name)) {
         const nameNon = await this.helper.nonAccentVietnamese(query.name);
         conditions[`nameNon`] = {
            $regex: new RegExp(nameNon, 'img'),
         };
      }

      if (isIn(query['active'], ['true', 'false', true, false])) {
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
         const result = this.interest.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.interest.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findAllFrontend(query: Record<string, any>): Promise<any> {
      const conditions = {};
      conditions['active'] = true;
      const sort = Object();
      sort[query.orderBy] = query.order;

      const projection = {};
      conditions['deletedAt'] = null;
      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
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
         const result = this.interest.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.interest.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findById(id: string): Promise<Interest> {
      return this.interest.findById(id).exec();
   }

   async findByIdFrontend(id: string): Promise<Interest> {
      return this.interest
         .findOne({
            _id: id,
            active: true,
         })
         .exec();
   }

   async findBySlug(slug: string): Promise<Interest> {
      return await this.interest.findOne({
         slug,
         active: true,
      });
   }

   async create(data: object): Promise<Interest> {
      const nameNon = await this.helper.nonAccentVietnamese(data['name']);
      data['nameNon'] = nameNon;
      return new this.interest(data).save();
   }

   async update(id: string, data: object): Promise<any> {
      const nameNon = await this.helper.nonAccentVietnamese(data['name']);
      data['nameNon'] = nameNon;
      return this.interest.findByIdAndUpdate(id, data, { new: true });
   }

   async deleteManyById(ids: Array<string>): Promise<any> {
      // return this.interest.deleteMany({_id: {$in: ids}});
      const data = {};

      data['active'] = false;
      data['deletedAt'] = moment().format('YYYY-MM-DD HH:mm:ss');

      const docs = await this.interest.updateMany({ _id: { $in: ids } }, data);

      return docs;
   }

   async changeStatus(data: any) {
      const item = await this.interest.findByIdAndUpdate(data.id, { active: data.active }, { returnOriginal: false });
      return item;
   }

   async createOnce(query: Record<string, any>, data: object): Promise<Interest> {
      return await this.interest.findOneAndUpdate(
         query,
         { $setOnInsert: data },
         { upsert: true, new: true, runValidators: true },
      );
   }
}
