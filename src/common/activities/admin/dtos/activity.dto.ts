import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
export class ActivityDto {
   @ApiProperty()
   screen: string;

   @ApiProperty()
   user: mongoose.Schema.Types.ObjectId;

   @ApiProperty()
   message_vi: string;

   @ApiProperty()
   message_en: string;

   @ApiProperty()
   url: string;

   @ApiProperty()
   aggregateID: string;

   @ApiProperty()
   method: string;

   @ApiProperty()
   dataResponse: object;

   @ApiProperty()
   dataRequest: object;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}
