import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@src/core/validator/IsExistFileTmp';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CustomerUpdateProfile {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   name: string;

   @IsNotEmpty({ message: 'email là bắt buộc!' })
   @ApiProperty()
   email: string;

   @IsNotEmpty({ message: 'phone là bắt buộc!' })
   @ApiProperty()
   phone: string;

   @IsNotEmpty({ message: 'dateOfBirth là bắt buộc!' })
   @ApiProperty()
   dateOfBirth: string;

   @IsNotEmpty({ message: 'gender là bắt buộc!' })
   @ApiProperty()
   gender: number;

   @IsOptional({ message: 'province là bắt buộc!' })
   @ApiProperty()
   province: string;

   @IsOptional({ message: 'district là bắt buộc!' })
   @ApiProperty()
   district: string;

   @IsOptional({ message: 'ward là bắt buộc!' })
   @ApiProperty()
   ward: string;
}

export class CustomerUpdatePass {
   @ApiProperty({
      description: 'oldPassword',
      maxLength: 255,
   })
   @IsNotEmpty()
   oldPassword: string;

   @ApiProperty({
      description: 'newPassword',
      maxLength: 255,
   })
   @IsNotEmpty()
   newPassword: string;
}

export class VertifyCodeDto {
   @ApiProperty({
      description: 'code',
      maxLength: 255,
   })
   @IsNotEmpty()
   vertifyCode: string;

   @ApiProperty({
      description: 'email',
      maxLength: 255,
   })
   @IsNotEmpty()
   email: string;
}

export class ResendVertifyCodeDto {
   @ApiProperty({
      description: 'email',
      maxLength: 255,
   })
   @IsNotEmpty()
   email: string;

   @ApiProperty({
      description: 'reCaptchaCode',
   })
   @IsNotEmpty({ message: 'reCaptchaCode là bắt buộc!' })
   reCaptchaCode: string;
}

export class ForgotPasswordDto {
   @ApiProperty({
      description: 'email',
   })
   @IsNotEmpty({ message: 'Email là bắt buộc!' })
   email: string;

   @ApiProperty({
      description: 'reCaptchaCode',
   })
   @IsNotEmpty({ message: 'reCaptchaCode là bắt buộc!' })
   reCaptchaCode: string;
}

export class ChangePasswordCustomerDto {
   @ApiProperty({
      description: 'code',
      maxLength: 255,
   })
   @IsNotEmpty()
   code: string;

   @ApiProperty({
      description: 'newPassword',
      maxLength: 255,
   })
   @IsNotEmpty()
   newPassword: string;
}

export class CustomerUpdateImage {
   @ApiProperty({
      type: 'file',
      description: 'profileImage',
      maxLength: 255,
      nullable: true,
   })
   @IsOptional()
   @IsExistFileTmp([], {
      message: 'Ảnh đại diện không hợp lệ!',
   })
   profileImage: string;
}
