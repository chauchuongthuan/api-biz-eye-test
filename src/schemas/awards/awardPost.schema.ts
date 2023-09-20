import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Award } from './awards.schema';
import { Category } from '../category/category.schema';
import { Expertise } from '../expertise/expertise.schema';
@Schema({
   timestamps: true,
   collection: 'Postawards',
})
export class AwardPost extends Document implements TimestampInterface {
   @Prop({
      required: false,
   })
   image: string;

   @Prop({
      required: false,
   })
   thumbnailVideo: string;

   @Prop({
      required: true,
      trim: true,
      default: false,
   })
   isHot: boolean;

   @Prop({
      required: true,
      trim: true,
      type: String,
   })
   shortDescription: string;

   @Prop({
      required: true,
      trim: true,
   })
   title: string;

   @Prop({
      trim: true,
      default: null,
   })
   titleNon: string;

   @Prop({
      required: true,
      trim: true,
   })
   slug: string;

   @Prop({
      required: true,
      trim: true,
   })
   challenge: string;

   @Prop({
      required: true,
      trim: true,
   })
   solution: string;

   @Prop({
      required: false,
   })
   detailImage: string;

   @Prop({
      required: true,
      trim: true,
   })
   client: string;

   @Prop({
      required: true,
      trim: true,
      type: Array,
   })
   shareOfVoice: any;

   @Prop({
      required: true,
      trim: true,
      type: String,
   })
   followers: string;

   @Prop({
      required: true,
      trim: true,
      type: String,
   })
   engagementRate: string;

   @Prop({
      required: true,
      trim: true,
      type: String,
   })
   impressions: string;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Award.name,
      },
   ])
   award: any;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Category.name,
      },
   ])
   category: any;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Expertise.name,
      },
   ])
   expertise: any;

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
      trim: true,
   })
   video: string;

   @Prop({
      required: true,
      trim: true,
      type: Array,
   })
   gallery: any;

   @Prop({
      required: true,
      trim: true,
      type: Array,
   })
   social: any;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   metaTitle: string;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   metaImage: string;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   metaDescription: string;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   metaKeyword: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const AwardPostSchema = SchemaFactory.createForClass(AwardPost);

AwardPostSchema.methods.thumbnail = function (): any {
   return {
      collection: 'Postawards',
      method: 'inside',
      fields: {
         detailImage: {},
         image: {},
         metaImage: {},
         thumbnailVideo: {},
      },
   };
};

AwardPostSchema.methods.thumbPhotos = function (field: string, type: string): object {
   return {
      collection: 'Postawards',
      method: 'inside',
      fields: {
         gallery: {},
         social: {},
      },
   };
};
