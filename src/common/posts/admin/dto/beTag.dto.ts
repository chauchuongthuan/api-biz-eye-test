import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty } from 'class-validator';

export class BeTagDto {
   @ApiProperty({
      type: String,
      description: 'name',
      required: true,
      maxLength: 255,
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @MaxLength(255, { message: 'Tên tối đa 255 ký tự' })
   name: string;

   @ApiProperty({
      type: String,
      description: 'slug',
      required: true,
      maxLength: 255,
   })
   @IsNotEmpty({ message: 'Slug là bắt buộc!' })
   @MaxLength(255, { message: 'Slug tối đa 255 ký tự' })
   slug: string;

   @ApiProperty({
      type: Boolean,
      description: 'active',
      required: true,
   })
   @IsNotEmpty({ message: 'Trạng thái là bắt buộc!' })
   active: boolean;

   @ApiProperty({
      type: Number,
      description: 'sortOrder',
      required: true,
   })
   @IsNotEmpty({ message: 'Thứ tự là bắt buộc!' })
   sortOrder: number;
}
