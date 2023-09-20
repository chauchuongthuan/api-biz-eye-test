// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { Prop } from '@nestjs/mongoose';

export class BePostAwardDto {
   @IsNotEmpty({ message: 'Title là bắt buộc!' })
   @ApiProperty()
   title: string;

   @IsNotEmpty({ message: 'Share Of Voice là bắt buộc!' })
   @ApiProperty()
   shareOfVoice: any;

   @IsNotEmpty({ message: 'Short Description là bắt buộc!' })
   @ApiProperty()
   shortDescription: string;

   @IsNotEmpty({ message: 'Challenge là bắt buộc!' })
   @ApiProperty()
   challenge: string;

   @IsNotEmpty({ message: 'Challenge là bắt buộc!' })
   @ApiProperty()
   solution: string;

   @IsNotEmpty({ message: 'Client là bắt buộc!' })
   @ApiProperty()
   client: string;

   // @IsNotEmpty({ message: 'Followers là bắt buộc!' })
   // @ApiProperty()
   // followers: string;

   // @IsNotEmpty({ message: 'Engagement Rate là bắt buộc!' })
   // @ApiProperty()
   // engagementRate: string;

   // @IsNotEmpty({ message: 'Impressions là bắt buộc!' })
   // @ApiProperty()
   // impressions: string;

   @IsNotEmpty({ message: 'Award là bắt buộc!' })
   @ApiProperty()
   award: any;

   @IsNotEmpty({ message: 'Category là bắt buộc!' })
   @ApiProperty()
   category: any;

   @IsNotEmpty({ message: 'Expertise là bắt buộc!' })
   @ApiProperty()
   expertise: any;

   @IsNotEmpty({ message: 'Gallery là bắt buộc!' })
   @ApiProperty()
   gallery: any;

   @IsNotEmpty({ message: 'Social là bắt buộc!' })
   @ApiProperty()
   social: any;

   @IsOptional()
   @ApiProperty()
   active: any;

   @IsOptional()
   @ApiProperty()
   isHost: any;

   @IsOptional()
   @ApiProperty()
   sortOrder: any;

   @IsOptional()
   @MaxLength(255)
   // @IsExistFileTmp([], {
   //    message: 'Ảnh đại diện không hợp lệ!',
   // })
   image: any;

   @IsOptional()
   @MaxLength(255)
   // @IsExistFileTmp([], {
   //    message: 'Ảnh đại diện không hợp lệ!',
   // })
   detailImage: any;

   @ApiProperty({
      description: 'metaTitle',
      required: false,
   })
   @IsOptional()
   metaTitle: string;

   @ApiProperty({
      description: 'metaImage',
      required: false,
      type: 'file',
   })
   @IsOptional()
   metaImage: any;

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
