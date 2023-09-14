import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthTypeEnum } from '@src/core/constants/auth.enum';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'customers',
})
export class Customer extends Document implements TimestampInterface {
   @Prop({
      required: false,
   })
   profileImage: string;

   @Prop({
      required: false,
      trim: true,
   })
   gender: string;
   @Prop({
      required: true,
      trim: true,
      index: true,
   })
   name: string;

   @Prop()
   nameNon: string;

   @Prop({
      required: false,
      trim: true,
      default: null,
   })
   dateOfBirth: Date;

   @Prop({
      required: true,
      trim: true,
      index: true,
      unique: true,
   })
   email: string;

   @Prop({
      required: false,
      trim: true,
      index: true,
      default: null,
      unique: true,
   })
   phone: string;

   @Prop({ nullable: true })
   password: string;

   @Prop({
      required: true,
      default: true,
   })
   active: boolean;

   @Prop({
      type: Number,
      default: AuthTypeEnum.APP,
      index: true,
   })
   authType: number;

   @Prop({
      type: SchemaTypes.Mixed,
      google: {
         id: { type: String, default: null },
         name: { type: String, default: null },
         email: { type: String, default: null },
      },
      facebook: {
         id: { type: String, default: null },
         name: { type: String, default: null },
         email: { type: String, default: null },
      },
   })
   social: object;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop({
      default: null,
   })
   lastLogin: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.methods.thumbnail = function (): any {
   return {
      collection: 'customers',
      method: 'inside',
      fields: {
         profileImage: {},
      },
   };
};

CustomerSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};
// CustomerSchema.post('save', function (error, doc, next) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         let fieldName = error.errmsg.substring(
//             error.errmsg.indexOf('index: ') + 7,
//             error.errmsg.indexOf('_1'),
//         );
//         let msg = '';
//         if (fieldName == 'email') {
//             msg = 'Email đã được đăng ký';
//         }
//         next(new Error(msg));
//     } else {
//         next(error);
//     }
// });
