import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { Author } from '@src/schemas/author/author.schemas';
import { Stories } from '@src/schemas/story/story.schemas';
const moment = require('moment');
@Injectable()
export class StoryService {
   constructor(@InjectModel(Stories.name) private story: PaginateModel<Stories>, private helperService: HelperService) {}

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

      if (isNotEmpty(query.name)) {
         const nameNon = this.helperService.removeSignVietnamese(query['name']);
         conditions['nameNon'] = {
            $regex: new RegExp(nameNon, 'img'),
         };
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
         const result = this.story.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.story.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<Stories> {
      return this.story.findOne(query);
   }

   async create(data: object): Promise<Stories> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      const item = await new this.story(data).save();
      return item;
   }

   async update(id: string, data: object): Promise<Stories> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      data['consultantsNon'] = this.helperService.nonAccentVietnamese(data['consultants']);
      const item = await this.story.findByIdAndUpdate(id, data, { returnOriginal: false });
      return item;
   }

   async detail(id: string): Promise<Stories> {
      return this.story.findById(id);
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.story.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }
}
