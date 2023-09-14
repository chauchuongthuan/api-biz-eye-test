import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { MailList } from '@src/schemas/marketing/mailList.schema';
import { ChangeStatusDto } from '../dto/beMailList.dto';
import { CommonProducerService } from '@src/common/queues/services/common.producer.service';
import { InterestService } from './interest.service';

const moment = require('moment');
const XLSX = require('xlsx');

@Injectable()
export class MailListService {
   constructor(
      @InjectModel(MailList.name) private mailList: PaginateModel<MailList>,
      private interest: InterestService,
      private commonService: CommonProducerService,
      private helper: HelperService,
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

      if (isNotEmpty(query.email)) {
         conditions['email'] = {
            $regex: new RegExp(query.email, 'img'),
         };
      }

      if (isNotEmpty(query.status)) {
         conditions['status'] = {
            $eq: query.status,
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
         const result = this.mailList.find(conditions).sort(sort).populate('interests').select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.mailList.paginate(conditions, {
            populate: ['interests'],
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<MailList> {
      return await this.mailList.findOne(query).populate('interests');
   }

   async create(data: object): Promise<MailList> {
      const self = this;
      const interestIds = [];

      if (typeof data['interests'] != 'undefined') {
         await Promise.all(
            data['interests'].map(async function (name, index) {
               if (!name) return;
               const slug = self.helper.removeSignVietnameseSlug(name);
               const nameNon = self.helper.removeSignVietnamese(name);
               const resultInterest = await self.interest.createOnce({ name }, { name, nameNon, active: true });
               interestIds.push(resultInterest.id);
            }),
         );
         data['interests'] = interestIds;
      }
      const item = await new this.mailList(data).save();
      return item;
   }

   async update(id: string, data: object): Promise<MailList> {
      const self = this;
      const interestIds = [];

      if (typeof data['interests'] != 'undefined') {
         await Promise.all(
            data['interests'].map(async function (name, index) {
               if (!name) return;
               const slug = self.helper.removeSignVietnameseSlug(name);
               const nameNon = self.helper.removeSignVietnamese(name);
               const resultInterest = await self.interest.createOnce({ name }, { name, nameNon, active: true });
               interestIds.push(resultInterest.id);
            }),
         );
         data['interests'] = interestIds;
      }
      const item = await this.mailList.findByIdAndUpdate(id, data, { returnOriginal: false });
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      return await this.mailList.deleteMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async detail(id: string): Promise<MailList> {
      return await this.mailList.findById(id).populate('interests');
   }

   async changeStatus(data: any) {
      const item = await this.mailList.findByIdAndUpdate(data.id, { status: data.status }, { returnOriginal: false });
      return item;
   }

   async import(file: any): Promise<number | HttpException> {
      let data: any = [];
      const workBook = XLSX.readFile(file.path, { type: 'binary' });
      workBook.SheetNames.forEach((sheet) => {
         data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
         return data;
      });
      await this.commonService.importMailList(data);
      // await this.importCustomer(data);
      return data.length * 2;
   }
}
