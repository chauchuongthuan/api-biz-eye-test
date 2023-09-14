import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import { User } from '@schemas/user/user.schemas';
import { Notification } from './notification.schema';
@Schema({
   timestamps: true,
   collection: 'seens',
})
export class Seen extends Document implements TimestampInterface {
   @Prop({
      trim: true,
      type: MongooseSchema.Types.ObjectId,
      ref: Notification.name,
   })
   notification: MongooseSchema.Types.ObjectId;

   @Prop({
      index: true,
      type: SchemaTypes.ObjectId,
      ref: User.name,
   })
   user: MongooseSchema.Types.ObjectId;

   @Prop()
   createdAt: Date;

   @Prop()
   updatedAt: Date;
}

export const SeenSchema = SchemaFactory.createForClass(Seen);
