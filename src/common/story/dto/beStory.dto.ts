// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BeStoryDto {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   name: string;

   @IsNotEmpty({ message: 'Link là bắt buộc!' })
   @ApiProperty()
   link: string;

   @IsNotEmpty({ message: 'Danh mục là bắt buộc!' })
   @ApiProperty()
   categoryId: string;

   @IsNotEmpty({ message: 'Mô tả ngắn là bắt buộc!' })
   @ApiProperty()
   shortdescription: string;

   @IsNotEmpty({ message: 'Mô tả là bắt buộc!' })
   @ApiProperty()
   description: string;

   @IsNotEmpty({ message: 'Tác giả là bắt buộc!' })
   @ApiProperty()
   authorId: string;
}
