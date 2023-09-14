import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class BePostCategoryDto {
   @ApiProperty({
      type: String,
      description: 'title',
      required: true,
   })
   @IsNotEmpty()
   title: string;

   @ApiProperty({
      type: String,
      description: 'slug',
      required: true,
   })
   @IsNotEmpty()
   slug: string;

   @ApiProperty({
      type: String,
      description: 'shortDescription',
      required: true,
   })
   @IsNotEmpty()
   shortDescription: string;

   // @ApiProperty({
   //     type: String,
   //     description: 'content',
   //     required: true,
   // })
   // @IsValidTrans([
   //     'required:false',
   //     'maxlength:10000',
   //     'transFile:postCategory'
   // ], {})
   // content: String;

   @ApiProperty({
      description: 'active',
      required: true,
   })
   @IsNotEmpty({ message: 'Trạng thái là bắt buộc!' })
   active: boolean;

   @ApiProperty({
      description: 'sortOrder',
      required: true,
      type: Number,
   })
   @IsNotEmpty({ message: 'Thứ tự là bắt buộc!' })
   sortOrder: number;

   @ApiProperty({ required: false })
   @IsOptional()
   metaTitle: string;

   @ApiProperty({
      description: 'metaImage',
      required: false,
   })
   @IsOptional()
   metaImage: string;

   @ApiProperty({
      type: String,
      description: 'meta description',
      required: false,
   })
   @IsOptional()
   metaDescription: string;

   @ApiProperty({
      type: String,
      description: 'meta keyword',
      required: false,
   })
   @IsOptional()
   metaKeyword: string;
}
