import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'expertises',
})
export class Expertise extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   title: string;

   @Prop({
      required: true,
      trim: true,
   })
   slug: string;

   @Prop({
      required: true,
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
      required: false,
      trim: true,
   })
   thumbImage: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const ExpertiseSchema = SchemaFactory.createForClass(Expertise);
