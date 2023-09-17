import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'awards',
})
export class Award extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   title: string;

   @Prop({
      required: true,
      trim: true,
   })
   subTitle: string;

   @Prop({
      required: true,
      trim: true,
   })
   client: string;

   @Prop({
      required: true,
      trim: true,
   })
   year: string;

   @Prop({
      required: true,
      trim: true,
   })
   slug: string;

   @Prop({
      required: false,
      trim: true,
   })
   shortDescription: string;

   @Prop({
      required: false,
      trim: true,
      default: null,
   })
   parentId: string;

   @Prop({
      required: false,
      trim: true,
      default: 1,
   })
   sortOrder: string;

   @Prop({
      required: true,
      trim: true,
      default: false,
   })
   active: boolean;

   @Prop({
      required: true,
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

export const AwardSchema = SchemaFactory.createForClass(Award);

AwardSchema.methods.thumbnail = function (): any {
   return {
      collection: 'awards',
      method: 'inside',
      fields: {
         image: {},
      },
   };
};
