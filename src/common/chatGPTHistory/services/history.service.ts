import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { Category } from '@src/schemas/category/category.schema';
import { History } from '@src/schemas/history/history.schema';
const moment = require('moment');
@Injectable()
export class HistoryService {
   constructor(@InjectModel(History.name) private history: PaginateModel<History>) {}

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
         conditions['name'] = {
            $regex: new RegExp(query.name, 'img'),
         };
      }

      if (isNotEmpty(query.nameNon)) {
         conditions['slug'] = {
            $regex: new RegExp(query.slug, 'img'),
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
         const result = this.history.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.history.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }
}
