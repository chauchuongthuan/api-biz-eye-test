import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsOptional } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { IsValidTrans } from '@core/validator/IsValidTrans';
import { IsValidFileTrans } from '@core/validator/IsValidFileTrans';
export class BePageDto {
   @ApiProperty({
      type: Object,
      description: 'name',
      required: true,
   })
   @IsValidTrans(['required:true', 'maxlength:255', 'transFile:page'], {})
   name: object;

   @ApiProperty({
      type: Object,
      description: 'content',
      required: true,
   })
   @IsValidTrans(['required:false', 'maxlength:10000', 'transFile:page'], {})
   content: object;

   @ApiProperty({ required: false })
   @IsValidTrans(['required:false', 'maxlength:255', 'transFile:page'], {})
   metaTitle: object;

   @ApiProperty({
      type: Object,
      description: 'metaImage',
      required: false,
   })
   @IsOptional()
   @IsValidFileTrans(['transFile:page'], {})
   metaImage: object;

   @ApiProperty({
      type: Object,
      description: 'meta description',
      required: true,
   })
   @IsValidTrans(['required:false', 'maxlength:10000', 'transFile:page'], {})
   metaDescription: object;

   @ApiProperty({
      type: Object,
      description: 'meta keyword',
      required: true,
   })
   @IsValidTrans(['required:false', 'maxlength:10000', 'transFile:page'], {})
   metaKeyword: object;

   @IsOptional()
   imageRms: Array<any>;
}
