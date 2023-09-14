import { CustomerCareType } from './customerCareType.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'customerCareLists',
})
export class CustomerCareList extends Document implements TimestampInterface {
   @Prop({
      required: true,
      default: true,
   })
   status: boolean;

   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      required: true,
      trim: true,
   })
   nameNon: string;

   @Prop({
      required: true,
      type: MongooseSchema.Types.ObjectId,
      ref: CustomerCareType.name,
   })
   type: MongooseSchema.Types.ObjectId;

   @Prop({
      trim: true,
      required: false,
   })
   content: string;

   @Prop({
      required: false,
   })
   image: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const CustomerCareListSchema = SchemaFactory.createForClass(CustomerCareList);

CustomerCareListSchema.methods.thumbnail = function (): any {
   return {
      collection: 'customerCareLists',
      method: 'inside',
      fields: {
         image: {},
      },
   };
};
