import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import { User } from '@schemas/user/user.schemas';
import { Customer } from './customer/customer.schemas';
@Schema({
   timestamps: true,
   collection: 'notifications',
})
export class Notification extends Document implements TimestampInterface {
   @Prop({
      required: false,
      default: null,
   })
   message: string;

   @Prop({
      required: false,
      default: null,
   })
   data: string;

   @Prop()
   type: number;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
