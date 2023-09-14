import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, IsNotEmpty, IsEmail } from 'class-validator';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';

export class ProfileDto {
   @ApiProperty({
      type: 'File',
      description: 'profileImage',
      maxLength: 255,
      nullable: true,
   })
   @IsOptional()
   @IsExistFileTmp([], {
      message: 'Ảnh đại diện không hợp lệ!',
   })
   profileImage: string;

   @ApiProperty({
      type: String,
      description: 'name',
      minLength: 5,
      maxLength: 255,
      required: true,
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @Length(5, 255, { message: 'Tên khoảng từ 5 - 255 ký tự!' })
   name: string;

   @ApiProperty({
      type: String,
      description: 'email',
      uniqueItems: true,
      required: true,
   })
   @IsEmail({}, { message: 'Email không hợp lệ!' })
   email: string;

   @ApiProperty({
      type: String,
      description: 'currentPassword',
      nullable: true,
   })
   @IsNotEmpty({ message: 'Mật khẩu hiện tại là bắt buộc!' })
   @Length(6, 255)
   currentPassword: string;

   @ApiProperty({
      type: String,
      description: 'newPassword',
      minLength: 6,
      maxLength: 255,
      nullable: true,
   })
   @IsOptional()
   @Length(6, 255)
   password: string;
}
