import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '@schemas/user/user.schemas';
@Schema({
   timestamps: true,
   collection: 'activities',
})
export class Activity extends Document implements TimestampInterface {
   @Prop()
   screen: string;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: 'User',
   })
   user: User;

   @Prop()
   message_vi: string;

   @Prop()
   message_en: string;

   @Prop()
   url: string;

   @Prop()
   aggregateID: string;

   @Prop()
   method: string;

   @Prop({
      type: Map,
   })
   dataResponse: object;

   @Prop({
      type: Map,
   })
   dataRequest: object;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
