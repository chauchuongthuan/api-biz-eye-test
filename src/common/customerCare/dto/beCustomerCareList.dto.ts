import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class BeCustomerCareListDto {
   @ApiProperty({
      description: 'name',
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @IsString()
   @MaxLength(255)
   name: string;

   @ApiProperty({
      description: 'type',
   })
   @IsNotEmpty({ message: 'Type là bắt buộc!' })
   type: string;

   @ApiProperty({
      description: 'status',
   })
   @IsOptional()
   status: boolean;

   @ApiProperty({
      description: 'content',
   })
   @IsOptional()
   content: string;

   @ApiProperty({
      description: 'image',
   })
   @IsOptional()
   @IsExistFileTmp([], {
      message: 'Ảnh không hợp lệ!',
   })
   image: any;
}

export class ChangeStatusDto {
   @ApiProperty({
      description: 'id',
   })
   @IsNotEmpty({ message: 'id là bắt buộc!' })
   id: string;

   @ApiProperty({
      description: 'status',
   })
   @IsNotEmpty({ message: 'status là bắt buộc!' })
   status: boolean;
}
