import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { HelperService } from '@src/core/services/helper.service';

import { Setting } from '@src/schemas/setting.schemas';

import { isNotEmpty } from 'class-validator';

import { PaginateModel } from 'mongoose';

const moment = require('moment');

@Injectable()
export class AccessesService {
   constructor(
      @InjectModel(Setting.name) private setting: PaginateModel<Setting>,

      private readonly helperService: HelperService,
   ) {}

   // async accessByMinute() {
   // const now = new Date();
   // const nowString = now.toISOString();
   // let data = await this.setting.findOne({ name: 'accessByMinute' });
   // let accessByMinute = {
   //    ...data,
   //    time: nowString,
   // };
   // return accessByMinute;
   // }
}
