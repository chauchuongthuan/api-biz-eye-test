import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'postCategories',
})
export class PostCategory extends Document {
   @Prop({
      type: String,
      required: true,
      unique: true,
      trim: true,
   })
   title: string;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   titleNon: string;

   @Prop({
      type: String,
      required: true,
      unique: true,
      trim: true,
   })
   slug: string;

   @Prop({
      type: String,
      required: false,
      trim: true,
   })
   shortDescription: string;

   // @Prop({
   //     type: String,
   //     required: false,
   //     trim: true
   // })
   // content: String;

   @Prop({
      required: true,
      default: 0,
   })
   sortOrder: number;

   @Prop({
      required: true,
      default: true,
   })
   active: boolean;

   @Prop({
      type: Map,
      hexColor: {
         type: String,
         default: null,
         trim: true,
      },
   })
   metaData: string;

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

export const PostCategorySchema = SchemaFactory.createForClass(PostCategory);

PostCategorySchema.methods.thumbnail = function (field: string, type: string): object {
   return {
      collection: 'postCategories',
      method: 'inside',
      fields: {
         metaImage: {
            FB: '600x314',
         },
      },
   };
};

PostCategorySchema.methods.fieldTranslations = function (): any {
   return {
      title: true,
   };
};

PostCategorySchema.post('save', function (error, doc, next) {
   if (error.name === 'MongoError' && error.code === 11000) {
      const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
      let msg = '';
      if (fieldName == 'slug') {
         msg = 'Slug đã được đăng ký';
      }
      // } else if(fieldName == 'slug.en') {
      //     msg = 'Slug (en) đã được đăng ký';
      // }
      next(new Error(msg));
   } else {
      next(error);
   }
});
