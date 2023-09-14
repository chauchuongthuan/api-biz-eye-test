import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import  from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
import { HelperService } from '@core/services/helper.service';
import { Customer } from '@schemas/customer/customer.schemas';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { MailSchedule } from '@src/schemas/marketing/mailSchedule.schema';
import { ChangeStatusDto } from '../dto/beMailSchedule.dto';
import { CommonProducerService } from '@src/common/queues/services/common.producer.service';
import { InterestService } from './interest.service';

const moment = require('moment');
const XLSX = require('xlsx');

@Injectable()
export class MailScheduleService {
   constructor(
      @InjectModel(MailSchedule.name) private MailSchedule: PaginateModel<MailSchedule>,
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
         const result = this.MailSchedule.find(conditions)
            .sort(sort)
            .populate('interests')
            .populate('assigned')
            .select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.MailSchedule.paginate(conditions, {
            populate: ['interests', 'assigned'],
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<MailSchedule> {
      return await this.MailSchedule.findOne(query).populate('interests').populate('assigned');
   }

   async create(data: object): Promise<MailSchedule> {
      const item = await new this.MailSchedule(data).save();
      return await this.MailSchedule.findById(item.id).populate('interests').populate('assigned');
      return item;
   }

   async update(id: string, data: object): Promise<MailSchedule> {
      const item = await this.MailSchedule.findByIdAndUpdate(id, data, { returnOriginal: false });
      return await this.MailSchedule.findById(id).populate('interests').populate('assigned');
      return item;
   }

   async deletes(ids: Array<string>): Promise<any> {
      return await this.MailSchedule.deleteMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async detail(id: string): Promise<MailSchedule> {
      return await this.MailSchedule.findById(id).populate('interests').populate('assigned');
   }

   async changeStatus(data: any) {
      const item = await this.MailSchedule.findByIdAndUpdate(data.id, { status: data.status }, { returnOriginal: false });
      return item;
   }
}
