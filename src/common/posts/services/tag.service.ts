import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { Tag } from '@schemas/posts/tag.schemas';
import { HelperService } from '@src/core/services/helper.service';
const moment = require('moment');
@Injectable()
export class TagService {
   private locale;

   constructor(
      @InjectModel(Tag.name) private tag: PaginateModel<Tag>,
      @Inject(REQUEST) private request: any,
      private helper: HelperService,
   ) {
      this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
   }

   async totalTag(): Promise<any> {
      return this.tag.countDocuments();
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
         const result = this.tag.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.tag.paginate(conditions, {
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
         const result = this.tag.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.tag.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findById(id: string): Promise<Tag> {
      return this.tag.findById(id).exec();
   }

   async findByIdFrontend(id: string): Promise<Tag> {
      return this.tag
         .findOne({
            _id: id,
            active: true,
         })
         .exec();
   }

   async findBySlug(slug: string): Promise<Tag> {
      return await this.tag.findOne({
         slug,
         active: true,
      });
   }

   async create(data: object): Promise<Tag> {
      const nameNon = await this.helper.nonAccentVietnamese(data['name']);
      data['nameNon'] = nameNon;
      return new this.tag(data).save();
   }

   async update(id: string, data: object): Promise<any> {
      const nameNon = await this.helper.nonAccentVietnamese(data['name']);
      data['nameNon'] = nameNon;
      return this.tag.findByIdAndUpdate(id, data, { new: true });
   }

   async deleteManyById(ids: Array<string>): Promise<any> {
      // return this.tag.deleteMany({_id: {$in: ids}});
      const data = {};

      data['active'] = false;
      data['deletedAt'] = moment().format('YYYY-MM-DD HH:mm:ss');

      const docs = await this.tag.updateMany({ _id: { $in: ids } }, data);

      return docs;
   }

   async createOnce(query: Record<string, any>, data: object): Promise<Tag> {
      return this.tag.findOneAndUpdate(query, { $setOnInsert: data }, { upsert: true, new: true, runValidators: true });
   }
}
