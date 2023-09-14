import { PostService } from './../../common/posts/services/post.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PubSubService } from '@src/items/pubsub.service';
import { Post } from '@src/schemas/posts/post.schemas';
import { Setting } from '@src/schemas/setting.schemas';
import { User } from '@src/schemas/user/user.schemas';
import { PaginateModel } from 'mongoose';

const path = require('path');
const moment = require('moment');
const sgMail = require('@sendgrid/mail');

@Injectable()
export class CronService {
   constructor(
      private pubSubService: PubSubService,
      @InjectModel(Post.name) private post: PaginateModel<Post>,
      @InjectModel(User.name) private user: PaginateModel<User>,
      @InjectModel(Setting.name) private setting: PaginateModel<Setting>,
   ) {}

   async deleteAccessByMonth() {
      let accessByMonth = await this.setting.findOne({ name: 'accessByMonth' });
      if (accessByMonth) {
         accessByMonth.value = '0';
         await accessByMonth.save();
      }
   }

   async getAccessByMinute() {
      const now = new Date();
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const nowString = hours + ':' + minutes;
      let data = await this.setting.findOne({ name: 'accessByMinute' });
      let accessByMinute = {
         name: data.name,
         value: data.value,
         time: nowString,
      };
      this.pubSubService.publishPubSub('accessByMinute', {
         accessByMinute: accessByMinute,
      });
   }

   async deleteAccessByMinute() {
      let accessByMinute = await this.setting.findOne({ name: 'accessByMinute' });
      if (accessByMinute) {
         accessByMinute.value = '1';
         await accessByMinute.save();
      }
   }
   async autoPublishPost() {
      let now = moment(new Date()).startOf('day');
      let posts = await this.post.find({ deletedAt: null });
      posts.map(async (post) => {
         if (post.publishedAt != null) {
            if (moment(post.publishedAt).startOf('day') <= now && post.status != 4) {
               const publishedPost = await this.post.findByIdAndUpdate(post.id, { status: 4 }, { new: true });
               if (publishedPost.assigned.length > 0) {
                  this.sendMailSendGrid(publishedPost, 'cập nhật trạng thái');
               }
            }
         }
      });
   }

   async sendMailSendGrid(data: any, message: string): Promise<boolean> {
      let mailTo = await Promise.all(
         data.assigned.map(async (element) => {
            let assigned = await this.user.findOne({ _id: element });
            return assigned.email;
         }),
      );
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const email = process.env.SENDGRID_EMAIL_SEND;
      const msg = {
         to: mailTo,
         from: {
            email,
            name: process.env.SENDGRID_TEMPLATE_SEND_NAME,
         },
         templateId: process.env.SENDGRID_TEMPLATE_STATUS_TASK,
         dynamic_template_data: {
            title: data.title,
            message: message,
            link: process.env.LINK_CMS_POST,
         },
      };
      try {
         sgMail.send(msg);
      } catch (error) {
         console.log(error);

         if (error.response) {
            console.error(error.response.body);
         }
      }
      return true;
   }
}
