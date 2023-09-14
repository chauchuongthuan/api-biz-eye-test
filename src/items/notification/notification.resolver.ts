import { Controller, Get, Inject } from '@nestjs/common';
import { Resolver, Query, Parent, Args, Mutation, Context, Subscription, Int } from '@nestjs/graphql';
import { NotificationType } from './notification.dto';
import { NotificationsService } from './notification.services';
import { UserAuthService } from '@src/common/auth/user/services/auth.service';
import { HelperService } from '@src/core/services/helper.service';
import { PubSubService } from '../pubsub.service';
import { Seen } from '@src/schemas/seens.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
const moment = require('moment');

// const pubSub = new PubSub();
// import pubSub from './pubSub.constant';
@Resolver((of) => NotificationType)
export class NotificationResolver {
   // private pubSub: PubSub;
   constructor(
      private readonly notificationsService: NotificationsService,
      private readonly authService: UserAuthService,
      private readonly helperService: HelperService,
      private readonly pubSubService: PubSubService,
      @InjectModel(Seen.name) private seenModel: PaginateModel<Seen>,
   ) {
      // this.pubSub = new PubSub();
   }

   @Query((returns) => [NotificationType])
   async items(
      @Context() ctx,
      @Args('page', { type: () => Int }) page: number,
      @Args('limit') limit: number,
      @Args('type', { nullable: true }) type?: number,
      @Args('seen', { nullable: true }) seen?: boolean,
   ): Promise<NotificationType[]> {
      if (!ctx.headers.authorization) {
         this.helperService.throwException('Token is missing!');
      }

      let token = ctx.headers.authorization ? ctx.headers.authorization.split(' ')[1] : null;
      let verify = await this.authService.verifyToken(token);
      let notifications = await this.notificationsService.findAll(
         { type, seen, page, limit },
         verify.user.shopId,
         verify.user._id,
      );
      for (let noti of notifications) {
         let seen = await this.seenModel.findOne({ user: verify.user._id, notification: noti.id });
         seen ? (noti.seen = true) : (noti.seen = false);
      }
      return notifications;
   }

   @Mutation((returns) => NotificationType)
   async seen(@Args('id') id: string, @Context() ctx): Promise<NotificationType> {
      if (!ctx.headers.authorization) {
         this.helperService.throwException('Token is missing!');
      }
      let token = ctx.headers.authorization ? ctx.headers.authorization.split(' ')[1] : null;
      let verify = await this.authService.verifyToken(token);
      let data = await this.notificationsService.seen(id, verify.user._id);
      data.seen = true;
      return data;
   }

   @Subscription((returns) => NotificationType, {})
   notification() {
      return this.pubSubService.asyncIterator('notification');
   }
}
