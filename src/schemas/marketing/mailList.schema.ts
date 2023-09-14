import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Interest } from './interest.schema';
@Schema({
   timestamps: true,
   collection: 'mailLists',
})
export class MailList extends Document implements TimestampInterface {
   @Prop([
      {
         type: SchemaTypes.ObjectId,
         ref: Interest.name,
      },
   ])
   interests: Array<any>;

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
      required: true,
      trim: true,
   })
   email: string;

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

export const MailListSchema = SchemaFactory.createForClass(MailList);

MailListSchema.methods.nonSignFields = function (): any {
   return {
      name: true,
   };
};
