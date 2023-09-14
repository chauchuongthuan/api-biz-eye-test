import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { CustomerCareType } from '@src/schemas/customerCare/customerCareType.schema';
import slugify from 'slugify';
const moment = require('moment');
@Injectable()
export class CustomerCareTypeService {
   constructor(@InjectModel(CustomerCareType.name) private customerCareType: PaginateModel<CustomerCareType>) {}

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
         const slug = slugify(query.name, { lower: true });
         conditions['slug'] = {
            $regex: new RegExp(slug, 'img'),
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
         const result = this.customerCareType.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.customerCareType.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<CustomerCareType> {
      return this.customerCareType.findOne(query);
   }

   async create(data: object, files?: Record<any, any>): Promise<CustomerCareType> {
      await convertContentFileDto(data, files, ['image']);
      const item = await new this.customerCareType(data).save();
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: object, files?: Record<any, any>): Promise<CustomerCareType> {
      await convertContentFileDto(data, files, ['image']);
      const item = await this.customerCareType.findByIdAndUpdate(id, data, { returnOriginal: false });
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.customerCareType.deleteMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async detail(id: string): Promise<CustomerCareType> {
      return this.customerCareType.findById(id);
   }

   async changeStatus(data: any) {
      const item = await this.customerCareType.findByIdAndUpdate(data.id, { status: data.status }, { returnOriginal: false });
      return item;
   }
}
