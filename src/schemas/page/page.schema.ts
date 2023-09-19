import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MultiLanguageContentProp, MultiLanguageProp } from '../utils/multiLanguageProp';
import { DateTime } from '@src/core/constants/dateTime.enum';

@Schema({
   timestamps: true,
   collection: 'pages',
})
export class Page extends Document {
   @Prop({
      required: true,
      trim: true,
      unique: true,
   })
   code: string;

   @Prop({ type: String })
   name: string;

   @Prop({ type: Object })
   content: object;

   @Prop({ type: Object })
   metaTitle: string;

   @Prop({ type: String })
   metaImage: string;

   @Prop({ type: String })
   metaDescription: string;

   @Prop({ type: Object })
   metaKeyword: object;

   @Prop({
      required: true,
      default: Date.now,
   })
   createdAt: Date;

   @Prop({
      required: true,
      default: Date.now,
   })
   updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);

PageSchema.methods.thumbnail = function (): any {
   return {
      collection: 'pages',
      method: 'inside',
      fields: {
         bannerImg: {},
         bannerImgMb: {},
         metaImage: {
            FB: '600x314',
         },
      },
   };
};
