import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'backups',
})
export class Backups extends Document implements TimestampInterface {
   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      required: true,
      trim: true,
   })
   nameNon: string;

   @Prop({
      required: true,
      trim: true,
   })
   server: string;

   @Prop({
      required: true,
      trim: true,
   })
   author: string;

   @Prop({
      required: false,
      default: 'Lưu thành công',
   })
   reason: string;

   @Prop({
      required: true,
      trim: true,
   })
   status: string;

   @Prop({
      default: null,
   })
   deletedAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const BackupsSchema = SchemaFactory.createForClass(Backups);
