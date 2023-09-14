import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'subscribers',
})
export class Subscriber extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   email: string;

   @Prop({
      required: true,
      default: true,
   })
   status: boolean;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
