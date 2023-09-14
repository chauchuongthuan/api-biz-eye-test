import { Optional } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class BeGptDto {
   @ApiProperty({
      type: String,
      description: 'message',
      minLength: 5,
      maxLength: 255,
   })
   @IsNotEmpty({ message: 'Nội dung là bắt buộc!' })
   message: string;

   @IsNotEmpty({ message: 'Loại không được để trống' })
   dataTypes: string;

   @IsOptional()
   language: string;
}
