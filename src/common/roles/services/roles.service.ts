import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '@schemas/role.schemas';
import { HelperService } from '@src/core/services/helper.service';
import { isIn, isNotEmpty } from 'class-validator';
import { PaginateModel } from 'mongoose';
const moment = require('moment');
@Injectable()
export class RolesService {
   constructor(@InjectModel(Role.name) private role: PaginateModel<Role>, private helperService: HelperService) {}

   async totalRole(): Promise<any> {
      return this.role.countDocuments();
   }

   async totalAdminRole(): Promise<any> {
      return this.role.countDocuments({ isAdmin: true });
   }

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

      if (isNotEmpty(query.nameNon)) {
         conditions['nameNon'] = {
            $regex: new RegExp(query.nameNon, 'img'),
         };
      }

      if (isIn(query['isAdmin'], [true, false, 'true', 'false'])) {
         conditions['isAdmin'] = query['isAdmin'];
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
         const result = this.role.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.role.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findById(id: string): Promise<Role> {
      return this.role.findById(id).exec();
   }

   async create(data: object): Promise<Role> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      return new this.role(data).save();
   }

   async update(id: string, data: object): Promise<any> {
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      return this.role.findByIdAndUpdate(id, data, { new: false });
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.role.deleteMany({ _id: { $in: ids } });
   }
}
