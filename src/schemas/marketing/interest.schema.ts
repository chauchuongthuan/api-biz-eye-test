import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'interests',
})
export class Interest extends Document implements TimestampInterface {
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
      default: true,
   })
   status: boolean;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const InterestSchema = SchemaFactory.createForClass(Interest);

InterestSchema.post('save', function (error, doc, next) {
   if (error.name === 'MongoError' && error.code === 11000) {
      const fieldName = error.errmsg.substring(error.errmsg.indexOf('index: ') + 7, error.errmsg.indexOf('_1'));
      let msg = '';
      if (fieldName == 'name') {
         msg = 'Name đã được đăng ký';
      }
      next(new Error(msg));
   } else {
      next(error);
   }
});

InterestSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};
