// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { Prop } from '@nestjs/mongoose';

export class BeExpertiseDto {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   title: string;

   @IsNotEmpty({ message: 'Slug là bắt buộc!' })
   @ApiProperty()
   slug: string;

   @IsNotEmpty({ message: 'Description là bắt buộc!' })
   @ApiProperty()
   shortDescription: string;

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
