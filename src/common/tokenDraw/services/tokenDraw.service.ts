import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { isIn, isNotEmpty } from 'class-validator';
import { convertContentFileDto, saveThumbOrPhotos } from '@core/helpers/content';
import { HelperService } from '@core/services/helper.service';
import { TokenDraw } from '@src/schemas/tokenDraw/tokenDraw';
import { CommonProducerService } from '@src/common/queues/services/common.producer.service';
const moment = require('moment');
const XLSX = require('xlsx');
@Injectable()
export class TokenDrawService {
   constructor(
      @InjectModel(TokenDraw.name) private tokenDraw: PaginateModel<TokenDraw>,
      private helperService: HelperService,
      private commonImport: CommonProducerService,
   ) {}

   async totalTokenDraw(): Promise<any> {
      return this.tokenDraw.countDocuments();
   }

   async totalInActiveTokenDraw(): Promise<any> {
      return this.tokenDraw.countDocuments({ active: false });
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
         const nameNon = this.helperService.nonAccentVietnamese(query.name);
         conditions['nameNon'] = {
            $regex: new RegExp(nameNon, 'img'),
         };
      }
      if (isNotEmpty(query.nameNon)) {
         conditions['nameNon'] = {
            $regex: new RegExp(query.nameNon, 'img'),
         };
      }

      if (isNotEmpty(query.token)) {
         conditions['token'] = {
            $regex: new RegExp(query.token, 'img'),
         };
      }

      if (isNotEmpty(query.role)) {
         conditions['role'] = {
            $eq: query.role,
         };
      }

      if (isIn(query['isWin'], [true, false, 'true', 'false'])) {
         conditions['isWin'] = query['isWin'];
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
         const result = this.tokenDraw.find(conditions).sort(sort).select(projection);
         return isNaN(get) ? result : result.limit(get);
      } else {
         return this.tokenDraw.paginate(conditions, {
            select: projection,
            page: query.page,
            limit: query.limit,
            sort: sort,
         });
      }
   }

   async findOne(query: Record<string, any>): Promise<TokenDraw> {
      return this.tokenDraw.findOne(query);
   }

   async create(data: any): Promise<any> {
      // find token
      const result = await this.tokenDraw.findOne({
         token: parseInt(data.token),
      });
      console.log(result);

      if (result) {
         return false;
      }
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      const item = await new this.tokenDraw(data).save();
      return item;
   }

   async update(id: string, data: any): Promise<any> {
      // find token
      const result = await this.tokenDraw.findOne({
         token: parseInt(data.token),
      });
      console.log(result);

      if (result) {
         return false;
      }
      console.log(result);
      data['nameNon'] = this.helperService.nonAccentVietnamese(data['name']);
      const item = await this.tokenDraw.findByIdAndUpdate(id, data, { new: true });
      return item;
   }

   async detail(id: string): Promise<TokenDraw> {
      return this.tokenDraw.findById(id);
   }

   async deletes(ids: Array<string>): Promise<any> {
      return this.tokenDraw.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
   }

   async updates(ids: string): Promise<any> {
      return this.tokenDraw.updateMany({ _id: { $in: ids } }, { isWin: false, winDate: null });
   }

   async updatesAll(): Promise<any> {
      return this.tokenDraw.updateMany({}, { isWin: false, winDate: null });
   }

   async import(file: any): Promise<number | HttpException> {
      let data: any = [];
      const workBook = XLSX.readFile(file.path, { type: 'binary' });
      workBook.SheetNames.forEach((sheet) => {
         data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
         return data;
      });
      await this.commonImport.importTokenDraw(data);
      // await this.importCustomer(data);
      return data.length * 2;
   }

   async startGame(): Promise<any> {
      // Array token avalible
      const tokens = [];
      // Condition find token
      const conditions = {
         isWin: false,
      };
      // Find all token in table not include isWin = false
      const data = await this.tokenDraw.find(conditions).select(['token', 'name']);
      let randomResult;
      if (data) {
         randomResult = await this.getRandomItem(data);
         // Update active when win
         await this.tokenDraw.findByIdAndUpdate(randomResult._id, { isWin: true, winDate: Date.now() }, { new: true });
         return randomResult;
      } else {
         return { data: [], message: 'Đã hết token' };
      }
   }

   async getRandomItem(array: Array<any>): Promise<any> {
      if (array.length === 0) {
         return undefined; // Return undefined for an empty array
      }
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
   }
}
