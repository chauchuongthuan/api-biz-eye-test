import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'tags',
})
export class Tag extends Document {
   @Prop({
      required: true,
      trim: true,
      unique: true,
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
      unique: true,
      set: function (slug) {
         slug = slug.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
         slug = slug.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
         slug = slug.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
         slug = slug.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
         slug = slug.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
         slug = slug.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
         slug = slug.replace(/đ/g, 'd');
         // Some system encode vietnamese combining accent as individual utf-8 characters
         slug = slug.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
         slug = slug.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

         slug = slug.replace(/^\s+|\s+$/g, '');
         slug = slug.replace(/\ +/g, '-');
         slug = slug.toLowerCase();
         return slug;
      },
   })
   slug: string;

   @Prop({
      required: true,
      default: true,
   })
   active: boolean;

   @Prop({
      required: true,
      default: 0,
   })
   sortOrder: number;

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

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.post('save', function (error, doc, next) {
   if (error.name === 'MongoError' && error.code === 11000) {
      const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
      let msg = '';
      if (fieldName == 'name') {
         msg = 'Name đã được đăng ký';
      } else if (fieldName == 'slug') {
         msg = 'Slug đã được đăng ký';
      }
      next(new Error(msg));
   } else {
      next(error);
   }
});

TagSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};
