import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
@ObjectType()
export class NotificationType {
   @Field(() => ID)
   @IsString()
   readonly id?: string;

   @Field()
   @IsString()
   readonly message: string;

   @Field()
   @IsString()
   readonly data: string;

   @Field()
   @IsString()
   readonly value: string;

   @Field()
   @IsString()
   readonly type: string;

   @Field()
   readonly seen: boolean;

   @Field({ nullable: true })
   readonly createdAt?: Date;
}
