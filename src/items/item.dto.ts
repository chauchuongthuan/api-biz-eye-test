import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
@ObjectType()
export class AccessType {
   //    @Field(() => ID)
   //    @IsString()
   //    readonly id?: string;

   // @Field(() => Int)
   // @IsString()
   // @IsNotEmpty()
   // readonly type: number;

   @Field()
   @IsString()
   readonly name: string;

   @Field()
   @IsString()
   readonly time: string;

   @Field()
   @IsString()
   readonly value: string;

   @Field({ nullable: true })
   readonly createdAt?: Date;
}
