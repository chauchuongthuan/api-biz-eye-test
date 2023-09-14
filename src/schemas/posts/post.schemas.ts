import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MultiLanguageProp, MultiLanguageSlugProp } from '@schemas/utils/multiLanguageProp';
import { PostCategory } from '@schemas/posts/postCategory.schemas';
import { Tag } from '@schemas/posts/tag.schemas';
import { StatusEnum } from '@core/constants/post.enum';
import { User } from '../user/user.schemas';
@Schema({
   timestamps: true,
   collection: 'posts',
})
export class Post extends Document {
   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: User.name,
      default: null,
   })
   author: any;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: User.name,
      default: null,
   })
   lastEditor: any;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: User.name,
      },
   ])
   assigned: Array<any>;

   // @Prop({
   //    index: true,
   //    type: SchemaTypes.ObjectId,
   //    ref: PostCategory.name,
   // })
   // postCategory: any;

   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Tag.name,
      },
   ])
   tags: Array<any>;

   @Prop({
      default: null,
   })
   image: string;

   @Prop({
      default: null,
   })
   imageMb: string;

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
      unique: true,
   })
   slug: string;

   @Prop({
      required: false,
      trim: true,
   })
   shortDescription: string;

   @Prop({
      required: true,
      trim: true,
   })
   content: string;

   @Prop({
      required: true,
      default: 0,
   })
   view: number;

   @Prop({
      required: false,
      default: {},
      type: Array,
   })
   gallery: any;

   @Prop({
      required: false,
      default: 0,
   })
   sortOrder: number;

   @Prop({
      required: true,
      default: StatusEnum.NEW,
   })
   status: number;

   @Prop({
      required: true,
      default: true,
   })
   feature: boolean;

   @Prop({
      nullable: true,
      default: null,
      index: true,
   })
   publishedAt: Date;

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

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods.thumbnail = function (field: string, type: string): object {
   return {
      collection: 'posts',
      method: 'inside',
      fields: {
         image: {},
         imageMb: {},
      },
      fieldTrans: {
         metaImage: {},
      },
   };
};

PostSchema.methods.thumbPhotos = function (field: string, type: string): object {
   return {
      collection: 'posts',
      method: 'inside',
      fields: {
         gallery: {},
      },
   };
};

PostSchema.methods.fieldTranslations = function (): any {
   return {
      title: true,
      // shortDescription: true,
   };
};

// PostSchema.index({ 'slug.vi': 1 }, { unique: true });
// PostSchema.index({ 'slug.en': 1 }, { unique: true });

PostSchema.post('save', function (error, doc, next) {
   if (error.name === 'MongoError' && error.code === 11000) {
      const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
      let msg = '';
      if (fieldName == 'slug') {
         msg = 'Slug đã được đăng ký';
      }
      next(new Error(msg));
   } else {
      next(error);
   }
});
