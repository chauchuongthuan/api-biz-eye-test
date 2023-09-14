import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { PostCategory } from '@schemas/posts/postCategory.schemas';
import { Post } from '@src/schemas/posts/post.schemas';
import {
   convertContent,
   saveThumbOrPhotos,
   saveFileContent,
   deleteSpecifyFile,
   deleteFileContent,
   convertContentFileDto,
} from '@core/helpers/content';
import { HelperService } from '@src/core/services/helper.service';
import { BePostCategoryDto } from '../admin/dto/bePostCategory.dto';
import { StatusEnum } from '@src/core/constants/post.enum';

const moment = require('moment');
@Injectable()
export class PostCategoryService {
   private locale;

   constructor(
      @InjectModel(PostCategory.name) private category: PaginateModel<PostCategory>,
      @InjectModel(Post.name) private postModel: PaginateModel<Post>,
      @Inject(REQUEST) private request: any,
      private helper: HelperService,
   ) {
      this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
   }

   async totalPostCategory(): Promise<any> {
      return this.category.countDocuments();
   }

   async findAll(query: Record<string, any>): Promise<any> {
      const locale = this.locale;
      const conditions = {};
      const sort = Object();

      sort[query.orderBy] = query.order;

      const projection = {};
      conditions['deletedAt'] = null;
      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
      }

      if (isNotEmpty(query.name)) {
         const name = await this.helper.nonAccentVietnamese(query.name);
         conditions[`name.${locale}`] = {
            $regex: new RegExp(name, 'img'),
         };
      }

      if (isNotEmpty(query.title)) {
         const titleNon = this.helper.nonAccentVietnamese(query.title);
         conditions[`titleNon`] = {
            $regex: new RegExp(titleNon, 'img'),
         };
      }

      if (isNotEmpty(query.shortDescription)) {
         conditions[`shortDescription.${locale}`] = {
            $regex: new RegExp(query.shortDescription, 'img'),
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
         const result = this.category.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.category.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findAllFrontend(query: Record<string, any>): Promise<any> {
      const locale = this.locale;
      const conditions = {};
      conditions['active'] = true;
      conditions['deletedAt'] = null;
      const sort = Object();
      query.orderBy = ['name'].indexOf(query.orderBy) != -1 ? `${query.orderBy}.${this.locale}` : query.orderBy;
      sort[query.orderBy] = query.order;

      const projection = {};

      if (isNotEmpty(query.selects)) {
         query.selects.split(',').forEach((select) => {
            projection[select] = 1;
         });
      }

      if (isNotEmpty(query.name)) {
         conditions[`name.${locale}`] = {
            $regex: new RegExp(query.name, 'img'),
         };
      }

      if (isNotEmpty(query.title)) {
         conditions[`title.${locale}`] = {
            $regex: new RegExp(query.title, 'img'),
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

      const count = await this.postModel.aggregate([
         { $match: { status: StatusEnum.PUBLISHED, publishedAt: { $lte: new Date() }, deletedAt: { $eq: null } } },
         { $group: { _id: '$postCategory', count: { $sum: 1 } } },
      ]);

      let rs;
      if (isNotEmpty(query.get)) {
         const get = parseInt(query.get);
         const result = this.category.find(conditions).sort(sort).select(projection);
         rs = isNaN(get) ? await result : await result.limit(get);
      } else {
         rs = await this.category.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }

      rs.map((item) => {
         if (
            ~count.findIndex(
               (ele) => ele?._id?.toString() === item?._id?.toString() || ele?.id?.toString() === item?.id?.toString(),
            )
         ) {
            const index = count.findIndex(
               (ele) => ele?._id?.toString() === item?._id?.toString() || ele?.id?.toString() === item?.id?.toString(),
            );
            item['count'] = count[index]['count'];
         } else item['count'] = 0;
      });

      return rs;
   }

   async findById(id: string): Promise<PostCategory> {
      return this.category.findById(id).exec();
   }

   async findBySlug(slug: string): Promise<PostCategory> {
      const locale = this.request.locale;
      const conditions = {};
      conditions[`slug.${locale}`] = slug;
      conditions[`active`] = true;
      return this.category.findOne(conditions).exec();
   }

   async create(data: BePostCategoryDto, files: Record<any, any>): Promise<PostCategory> {
      const category = await this.category.findOne({ slug: data.slug });
      if (category) {
         this.helper.throwException('Slug đã tồn tại', 400);
      }
      data['titleNon'] = this.helper.nonAccentVietnamese(data.title);
      await convertContentFileDto(data, files, ['metaImage']);
      const item = await new this.category(data).save();
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: BePostCategoryDto, files: Record<any, any>): Promise<PostCategory> {
      const category = await this.category.findOne({ slug: data.slug, _id: { $nin: id } });
      if (category) {
         this.helper.throwException('Slug đã tồn tại', 400);
      }
      data['titleNon'] = this.helper.nonAccentVietnamese(data.title);
      await convertContentFileDto(data, files, ['metaImage']);
      const item = await this.category.findByIdAndUpdate(id, data, { new: true });
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      // return this.category.find({_id: {$in: ids}}, function(error, docs) {
      //     if(docs) {
      //         docs.forEach(function(doc) {
      //             doc.remove();
      //             // deleteFileContent('content', doc, 'postCategories');
      //         });
      //     }
      // });

      const data = {};

      data['active'] = false;
      data['deletedAt'] = moment().format('YYYY-MM-DD HH:mm:ss');

      const docs = await this.category.updateMany({ _id: { $in: ids } }, data);

      return docs;
   }
}
