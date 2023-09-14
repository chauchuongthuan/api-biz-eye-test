import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'roles',
})
export class Role extends Document implements TimestampInterface, TimestampInterface {
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
   prefix: string;

   @Prop({
      type: Object,
      trim: true,
   })
   permissions: Record<any, any>;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
