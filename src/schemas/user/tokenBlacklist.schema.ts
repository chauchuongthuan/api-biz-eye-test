import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
   timestamps: true,
   collection: 'tokenBlacklist',
})
export class TokenBlacklist extends Document implements TimestampInterface {
   @Prop({
      required: true,
      index: true,
   })
   token: string;

   @Prop({
      required: true,
      index: true,
   })
   guard: string;

   @Prop({
      required: true,
      index: true,
   })
   expireAt: Date;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const TokenBlacklistSchema = SchemaFactory.createForClass(TokenBlacklist);
