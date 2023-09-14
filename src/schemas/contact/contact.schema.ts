import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'contacts',
})
export class Contact extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      required: true,
      trim: true,
   })
   email: string;

   @Prop({
      required: true,
      trim: true,
   })
   phone: string;

   @Prop({
      required: false,
      trim: true,
   })
   message: string;

   @Prop({
      required: true,
      trim: true,
      default: 1,
   })
   status: number;

   @Prop({
      required: false,
      trim: true,
   })
   messageFile: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.methods.thumbnail = function (): any {
   return {
      collection: 'contacts',
      method: 'inside',
      fields: {
         messageFile: {},
      },
   };
};
