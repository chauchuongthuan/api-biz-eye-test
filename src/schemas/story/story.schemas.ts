import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Author } from '../author/author.schemas';
import { Category } from '../category/category.schema';

@Schema({
   timestamps: true,
   collection: 'stories',
})
export class Stories extends Document implements TimestampInterface, TimestampInterface {
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

   @Prop({
      required: true,
      trim: true,
   })
   link: string;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: Category.name,
   })
   categoryId;

   @Prop({
      required: true,
      trim: true,
   })
   slug: string;

   @Prop({
      required: true,
      trim: true,
   })
   shortdescription: string;

   @Prop({
      required: true,
      trim: true,
   })
   description: string;

   @Prop({
      required: false,
   })
   thumbnail: string;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: Author.name,
   })
   authorId: string;

   @Prop({
      required: true,
      default: 5,
   })
   review: number;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const StoriesSchema = SchemaFactory.createForClass(Stories);
