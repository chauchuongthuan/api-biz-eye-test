import { Controller, Get, Inject } from '@nestjs/common';
import { Resolver, Query, Parent, Args, Mutation, Context, Subscription, Int } from '@nestjs/graphql';
import { AccessType } from './item.dto';
import { AccessesService } from './item.service';
import { UserAuthService } from '@src/common/auth/user/services/auth.service';
import { HelperService } from '@src/core/services/helper.service';
import { PubSubService } from './pubsub.service';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
const moment = require('moment');

// const pubSub = new PubSub();
// import pubSub from './pubSub.constant';
@Resolver((of) => AccessType)
export class AccessByMinuteResolver {
   // private pubSub: PubSub;
   constructor(
      private readonly accessesService: AccessesService,
      private readonly authService: UserAuthService,
      private readonly helperService: HelperService,
      private readonly pubSubService: PubSubService,
   ) {
      // this.pubSub = new PubSub();
   }

   // @Query((returns) => [AccessType])
   // async items(@Context() ctx): Promise<AccessType> {
   //    let accessByMinute = await this.accessesService.accessByMinute();
   //    // for(let noti of accessByMinute){
   //    //   seen ? noti.seen = true : noti.seen = false;
   //    // }
   //    return accessByMinute;
   // }

   // @Subscription((returns) => AccessType)
   // accessByMinute() {
   //    return this.pubSubService.asyncIterator('accessByMinute');
   // }
}
