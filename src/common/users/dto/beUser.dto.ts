import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
export class BeUserDto {
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
      description: 'nameNon',
      maxLength: 255,
      nullable: true,
   })
   nameNon: string;

   @ApiProperty({
      type: 'File',
      description: 'profileImage',
      maxLength: 255,
      nullable: true,
   })
   @IsOptional()
   @MaxLength(255)
   @IsExistFileTmp([], {
      message: 'Ảnh đại diện không hợp lệ!',
   })
   profileImage: any;

   @ApiProperty({
      type: String,
      description: 'email',
      uniqueItems: true,
      required: true,
   })
   @IsNotEmpty({ message: 'Email là bắt buộc!' })
   @IsEmail({}, { message: 'Email không hợp lệ!' })
   email: string;

   @ApiProperty({
      type: String,
      description: 'password',
      minLength: 6,
      maxLength: 255,
   })
   @IsOptional()
   @Length(6, 255, { message: 'Mật khẩu nằm trong 6 - 255 ký tự' })
   password: string;

   @ApiProperty({
      type: Boolean,
      description: 'active',
      required: false,
   })
   @IsOptional()
   active: boolean;

   @ApiProperty({
      type: String,
      description: 'id of role',
      nullable: true,
   })
   @IsNotEmpty({ message: 'Vai trò là bắt buộc!' })
   role: string;
}
