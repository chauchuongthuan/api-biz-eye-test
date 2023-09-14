import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   collection: 'settings',
})
export class Setting extends Document {
   @Prop({
      required: true,
      trim: true,
   })
   name: string;

   @Prop({
      trim: true,
   })
   value: string;

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

export const SettingSchema = SchemaFactory.createForClass(Setting);
