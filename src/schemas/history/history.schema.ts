import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthTypeEnum } from '@src/core/constants/auth.enum';
import { Document, SchemaTypes } from 'mongoose';
@Schema({
   timestamps: true,
   collection: 'history',
})
export class History extends Document implements TimestampInterface {
   @Prop({
      required: true,
   })
   question: string;

   @Prop({
      required: true,
   })
   questionNon: string;

   @Prop({
      required: true,
   })
   answer: string;

   @Prop({
      required: true,
   })
   dataTypes: string;

   @Prop({
      required: true,
   })
   responseTime: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
