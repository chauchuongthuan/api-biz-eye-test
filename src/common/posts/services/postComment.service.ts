import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isNotEmpty, isIn } from 'class-validator';
import { PostComment } from '@schemas/posts/postComment.schemas';
import {
   convertContent,
   saveThumbOrPhotos,
   saveFileContent,
   deleteSpecifyFile,
   deleteFileContent,
   convertContentFileDto,
} from '@core/helpers/content';
import { HelperService } from '@src/core/services/helper.service';
import { BePostCommentDto } from '../admin/dto/bePostComment.dto';

const moment = require('moment');
@Injectable()
export class PostCommentService {
   private locale;
   private user;
   constructor(
      @InjectModel(PostComment.name) private comment: PaginateModel<PostComment>,
      @Inject(REQUEST) private request: any,
      private helper: HelperService,
   ) {
      this.locale = this.request.locale == 'vi' ? 'viNon' : this.request.locale;
      this.user = this.request.user;
   }

   async totalPostComment(): Promise<any> {
      return this.comment.countDocuments();
   }

   async findAll(query: Record<string, any>): Promise<any> {
      let conditions = {};
      conditions['deletedAt'] = null;
      conditions['post'] = { $eq: query.postId };
      let sort = Object();
      sort[query.orderBy] = query.order;

      let projection = {};

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
         let createdFrom = moment(query.createdFrom || '1000-01-01').startOf('day');
         let createdTo = moment(query.createdTo || '3000-01-01').endOf('day');
         conditions[`createdAt`] = {
            $gte: createdFrom,
            $lte: createdTo,
         };
      }

      if (isNotEmpty(query.get)) {
         let get = parseInt(query.get);
         let result = this.comment.find(conditions).sort(sort).select(projection).populate('author').populate('post');
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.comment.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
            populate: ['post', 'author'],
         });
      }
   }

   async findById(id: string): Promise<PostComment> {
      return this.comment.findById(id).exec();
   }

   async create(data: BePostCommentDto, files: Record<any, any>): Promise<PostComment> {
      data['author'] = this.user._id;
      const item = await new this.comment(data).save();
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async update(id: string, data: BePostCommentDto, files: Record<any, any>): Promise<PostComment> {
      const item = await this.comment.findByIdAndUpdate(id, data, { new: true });
      if (item) await saveThumbOrPhotos(item);
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      // return this.comment.find({_id: {$in: ids}}, function(error, docs) {
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

      const docs = await this.comment.deleteMany({ _id: { $in: ids } }, data);

      return docs;
   }
}
