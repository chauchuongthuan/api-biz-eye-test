import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from '../role.schemas';
@Schema({
   timestamps: true,
   collection: 'users',
})
export class User extends Document implements TimestampInterface {
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
      trim: true,
   })
   profileImage: string;

   @Prop({
      required: true,
      trim: true,
      unique: true,
   })
   email: string;

   @Prop({
      required: true,
   })
   password: string;

   @Prop({
      required: true,
      default: true,
   })
   active: boolean;

   @Prop({
      required: false,
   })
   token: string;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: Role.name,
   })
   role;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Remove password
UserSchema.methods.toJSON = function () {
   const obj = this.toObject();
   delete obj.password;
   return obj;
};

UserSchema.methods.thumbnail = function (): any {
   return {
      collection: 'users',
      method: 'inside',
      fields: {
         profileImage: {},
      },
   };
};

UserSchema.post('save', function (error, doc, next) {
   if (error.name === 'MongoError' && error.code === 11000) {
      const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
      let msg = '';
      if (fieldName == 'email') {
         msg = 'Email đã được đăng ký';
      }
      next(new Error(msg));
   } else {
      next(error);
   }
});

UserSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};
