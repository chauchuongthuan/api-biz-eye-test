// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { Prop } from '@nestjs/mongoose';

export class BeAwardDto {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   title: string;

   @IsNotEmpty({ message: 'Sub là bắt buộc!' })
   @ApiProperty()
   subTitle: string;

   @IsNotEmpty({ message: 'Year là bắt buộc!' })
   @ApiProperty()
   year: string;

   @IsNotEmpty({ message: 'Slug là bắt buộc!' })
   @ApiProperty()
   slug: string;

   @IsNotEmpty({ message: 'Client là bắt buộc!' })
   @ApiProperty()
   client: string;

   @IsOptional()
   @MaxLength(255)
   @IsExistFileTmp([], {
      message: 'Ảnh đại diện không hợp lệ!',
   })
   image: any;

   @IsNotEmpty({ message: 'Active là bắt buộc!' })
   @ApiProperty()
   active: boolean;

   @Prop({
      required: false,
      trim: true,
      default: null,
   })
   @ApiProperty()
   parentId: string;
}
