import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'author',
})
export class Author extends Document implements TimestampInterface, TimestampInterface {
   @Prop({
      required: false,
      default: null,
   })
   avatar: string;

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
      default: false,
   })
   isActive: boolean;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
