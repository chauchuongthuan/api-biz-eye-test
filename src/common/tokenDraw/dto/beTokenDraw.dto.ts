import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
export class BeTokenDrawDto {
   @ApiProperty({
      type: String,
      description: 'name',
      required: true,
      minLength: 5,
      maxLength: 255,
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @Length(5, 255, { message: 'Tên nằm trong khoảng 5 đến 255 ký tự!' })
   name: string;

   @ApiProperty({
      type: String,
      description: 'token',
      required: true,
      minLength: 3,
      maxLength: 3,
   })
   @IsNotEmpty({ message: 'Token là bắt buộc!' })
   @Length(3, 3, { message: 'Maxlength 3 char !' })
   token: string;
}
