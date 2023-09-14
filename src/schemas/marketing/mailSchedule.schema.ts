import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Interest } from './interest.schema';
import { MailList } from './mailList.schema';

@Schema({
   timestamps: true,
   collection: 'mailSchedules',
})
export class MailSchedule extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      trim: true,
      default: null,
   })
   nameNon: string;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Interest.name,
      },
   ])
   interests: Array<any>;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: MailList.name,
      },
   ])
   assigned: Array<any>;

   @Prop({
      default: null,
   })
   template: string;

   @Prop({
      required: true,
      default: true,
   })
   status: boolean;

   @Prop({
      default: false,
   })
   statusSent: boolean;

   @Prop({
      default: null,
   })
   sendAt: Date;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const MailScheduleSchema = SchemaFactory.createForClass(MailSchedule);

MailScheduleSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};

MailScheduleSchema.methods.thumbnail = function (field: string, type: string): object {
   return {
      collection: 'mailSchedules',
      method: 'inside',
      fields: {
         template: {},
      },
   };
};
