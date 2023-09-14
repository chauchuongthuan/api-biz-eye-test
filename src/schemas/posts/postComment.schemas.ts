import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Tag } from '@schemas/posts/tag.schemas';
import { User } from '../user/user.schemas';
import { Post } from './post.schemas';
@Schema({
   timestamps: true,
   collection: 'postComments',
})
export class PostComment extends Document {
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
      ref: Post.name,
   })
   post: any;

   @Prop({
      required: true,
      trim: true,
   })
   content: string;

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

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);

// PostCommentSchema.methods.thumbnail = function (field: string, type: string): object {
//    return {
//       collection: 'posts',
//       method: 'inside',
//       fields: {
//          image: {},
//          imageMb: {},
//       },
//       fieldTrans: {
//          metaImage: {
//             FB: '600x314',
//          },
//       },
//    };
// };

// PostCommentSchema.methods.fieldTranslations = function (): any {
//    return {
//       title: true,
//       shortDescription: true,
//    };
// };

// // PostSchema.index({ 'slug.vi': 1 }, { unique: true });
// // PostSchema.index({ 'slug.en': 1 }, { unique: true });

// PostCommentSchema.post('save', function (error, doc, next) {
//    if (error.name === 'MongoError' && error.code === 11000) {
//       const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
//       let msg = '';
//       if (fieldName == 'slug') {
//          msg = 'Slug đã được đăng ký';
//       }
//       next(new Error(msg));
//    } else {
//       next(error);
//    }
// });
