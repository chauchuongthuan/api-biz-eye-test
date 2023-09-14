import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class BeRoleDto {
   @ApiProperty({
      type: String,
      description: 'name',
      required: true,
      maxLength: 255,
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @MaxLength(255, { message: 'Tên có độ dài tối đa 255 ký tự!' })
   name: string;

   @ApiProperty({
      type: Boolean,
      description: 'isAdmin',
      required: true,
   })
   @IsNotEmpty({ message: 'Thuộc tính isAdmin là bắt buộc!' })
   isAdmin: boolean;

   @ApiProperty({
      type: Object,
      description: 'permissions',
      required: false,
   })
   @IsOptional()
   permissions: object;
}
