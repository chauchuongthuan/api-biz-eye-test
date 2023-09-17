import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { Award } from '@src/schemas/awards/awards.schema';
import { convertContentFileDto, saveThumbOrPhotos } from '@src/core/helpers/content';
import { AwardPost } from '@src/schemas/awards/awardPost.schema';
const moment = require('moment');
@Injectable()
export class AwardPostService {
   constructor(@InjectModel(AwardPost.name) private award: PaginateModel<AwardPost>) { }

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
         const result = this.award.find(conditions).sort(sort).populate(['category', 'award']).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.award.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
            populate: ['category', 'award'],
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<AwardPost> {
      return this.award.findOne(query);
   }

   async create(data: object, files: Record<any, any>): Promise<AwardPost> {
      await convertContentFileDto(data, files, ['detailImage', 'image', 'social', 'gallery', 'metaImage']);

      const item = await new this.award(data).save();
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: object): Promise<AwardPost> {
      const item = await this.award.findByIdAndUpdate(id, data, { returnOriginal: false });
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.award.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async detail(id: string): Promise<Award> {
      return this.award.findById(id);
   }
}