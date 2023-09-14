import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional } from 'class-validator';

export class BeInterestDto {
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
      type: Boolean,
      description: 'active',
      required: true,
   })
   @IsNotEmpty({ message: 'Trạng thái là bắt buộc!' })
   active: boolean;
}

export class ChangeStatusDto {
   @ApiProperty({
      description: 'id',
   })
   @IsNotEmpty({ message: 'id là bắt buộc!' })
   id: string;

   @ApiProperty({
      description: 'active',
   })
   @IsNotEmpty({ message: 'active là bắt buộc!' })
   active: boolean;
}
