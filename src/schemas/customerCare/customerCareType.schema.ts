import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'customerCareTypes',
})
export class CustomerCareType extends Document implements TimestampInterface {
   @Prop({
      required: true,
      default: true,
   })
   status: boolean;

   @Prop({
      trim: true,
      required: false,
   })
   image: string;

   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      required: true,
      trim: true,
   })
   slug: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const CustomerCareTypeSchema = SchemaFactory.createForClass(CustomerCareType);

CustomerCareTypeSchema.methods.thumbnail = function (): any {
   return {
      collection: 'customerCareTypes',
      method: 'inside',
      fields: {
         image: {},
      },
   };
};
