import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from 'src/core/services/helper.service';
import { UserService } from 'src/common/users/services/user.service';
import { convertContentFileDto, deleteSpecifyFile, saveFileContent, saveThumbOrPhotos } from 'src/core/helpers/content';
import { Page } from '@src/schemas/page/page.schema';
import { BePageDto } from '../dto/bePage.dto';
import { async } from 'rxjs';
const moment = require('moment');
@Injectable()
export class PageService {
   constructor(
      @InjectModel(Page.name) private pages: PaginateModel<Page>,
      private helperService: HelperService,
      private userService: UserService,
   ) { }

   async detail(id: string): Promise<any> {
      return this.pages.findOne({ _id: id, deleteAt: null });
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
         conditions['name'] = {
            $regex: new RegExp(query.name, 'img'),
         };
      }

      if (isNotEmpty(query.metaTitle)) {
         conditions['metaTitle'] = {
            $regex: new RegExp(query.metaTitle, 'img'),
         };
      }

      if (isNotEmpty(query.metaKeyword)) {
         conditions['metaKeyword'] = {
            $regex: new RegExp(query.metaKeyword, 'img'),
         };
      }

      if (isNotEmpty(query.metaDescription)) {
         conditions['metaDescription'] = {
            $regex: new RegExp(query.metaDescriptionn, 'img'),
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
         const result = this.pages.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.pages.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }
   async findById(id: string): Promise<Page> {
      const item = await this.pages.findById(id);
      await saveFileContent('content', item, 'pages', false);
      return item;
   }
   async update(id: string, data: BePageDto, files: Array<any>): Promise<Page> {
      console.log(files);

      // if (!data.content) data.content = { vi: [], en: [] };
      // if (!data.metaImage) data.metaImage = { vi: '', en: '' };

      //unique image deleted
      data.imageRms = [...new Set(data.imageRms)];

      files.forEach((file) => {
         let fields = file.fieldname.replaceAll('[', ' ').replaceAll(']', '').split(' ');
         fields = fields.filter((field) => isNotEmpty(field));
         this.assignStringFieldToObject(data, fields, file.filename);
      });

      const item = await this.pages.findByIdAndUpdate(id, data, { new: true });

      if (item) {
         try {
            await Promise.all([
               saveThumbOrPhotos(item),
               saveFileContent('content', item, 'pages', true),
               deleteSpecifyFile(data.imageRms, `pages/${id}/content`),
            ]);
         } catch (error) {
            console.log(error);
         }
      }
      return item;
   }
   assignStringFieldToObject(data: any, fields: Array<any>, value: any) {
      if (fields.length == 1) {
         data[fields[0]] = value;
      } else {
         const field = fields.shift();
         this.assignStringFieldToObject(data[field], fields, value);
      }
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.pages.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }
}
