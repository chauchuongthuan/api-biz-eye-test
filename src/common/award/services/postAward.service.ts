import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { Award } from '@src/schemas/awards/awards.schema';
import { convertContentFileDto, saveThumbOrPhotos } from '@src/core/helpers/content';
import { AwardPost } from '@src/schemas/awards/awardPost.schema';
import { HelperService } from '@src/core/services/helper.service';
import { Category } from '@src/schemas/category/category.schema';
import { Expertise } from '@src/schemas/expertise/expertise.schema';
const moment = require('moment');
@Injectable()
export class AwardPostService {
   constructor(
      private helper: HelperService,
      @InjectModel(AwardPost.name) private award: PaginateModel<AwardPost>,
      @InjectModel(Category.name) private category: PaginateModel<Category>,
      @InjectModel(Expertise.name) private expertise: PaginateModel<Expertise>,
   ) {}

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

      if (isNotEmpty(query.title)) {
         const titleNon = this.helper.nonAccentVietnamese(query.title);
         conditions['titleNon'] = {
            $regex: new RegExp(titleNon, 'img'),
         };
      }

      if (isNotEmpty(query.category)) {
         conditions['category'] = {
            $in: [query.category],
         };
      }

      if (isNotEmpty(query.expertise)) {
         console.log(query.expertise);
         conditions['expertise'] = {
            $in: [query.expertise],
         };
      }

      if (isNotEmpty(query.nameNon)) {
         conditions['slug'] = {
            $regex: new RegExp(query.slug, 'img'),
         };
      }

      if (isNotEmpty(query.category)) {
         conditions['category'] = {
            $in: query.category,
         };
      }

      if (isNotEmpty(query.award)) {
         conditions['award'] = {
            $in: query.award,
         };
      }

      if (isNotEmpty(query.expertise)) {
         conditions['expertise'] = {
            $in: query.expertise,
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
         const result = this.award.find(conditions).sort(sort).populate(['category', 'award', 'expertise']).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.award.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
            populate: ['category', 'award', 'expertise'],
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<AwardPost> {
      return this.award.findOne(query);
   }

   async create(data: object, files: Record<any, any>): Promise<AwardPost> {
      await convertContentFileDto(data, files, ['detailImage', 'image', 'social', 'gallery', 'metaImage', 'thumbnailVideo']);
      const titleNon = this.helper.nonAccentVietnamese(data['title']);
      data['titleNon'] = titleNon;
      const item = await new this.award(data).save();
      if (item.isHost == true) {
         await this.award.updateMany({ _id: { $ne: item._id } }, { isHost: false });
      }
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: object, files: Record<any, any>): Promise<AwardPost> {
      await convertContentFileDto(data, files, ['detailImage', 'image', 'social', 'gallery', 'metaImage', 'thumbnailVideo']);
      const titleNon = this.helper.nonAccentVietnamese(data['title']);
      data['titleNon'] = titleNon;
      const item = await this.award.findByIdAndUpdate(id, data, { returnOriginal: false });
      if (item.isHost == true) {
         console.log('item::', item);
         await this.award.updateMany({ _id: { $ne: item._id } }, { isHost: false });
      }
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.award.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async detail(id: string): Promise<Award> {
      return this.award.findById(id).populate('category').populate('award').populate('expertise');
   }

   async findBySlug(slug: string): Promise<any> {
      const conditions = {};
      conditions[`slug`] = slug;
      conditions[`active`] = true;
      // conditions['publishedAt'] = { $lte: moment().format('YYYY-MM-DD HH:mm:ss') };
      return await this.award.findOne(conditions).populate('category').populate('award').populate('expertise');
   }
}
