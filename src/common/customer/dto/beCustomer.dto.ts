// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BeCustomerDto {
   @ApiProperty({
      description: 'gender',
      required: false,
   })
   @IsOptional()
   gender: string;

   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty({
      description: 'name',
      required: true,
   })
   name: string;

   @IsOptional()
   @ApiProperty({
      description: 'active',
      required: true,
   })
   active: boolean;

   @IsOptional()
   @ApiProperty({
      description: 'email',
      required: false,
   })
   email: string;

   @IsNotEmpty({ message: 'Số điện thoại là bắt buộc!' })
   @ApiProperty({
      description: 'phone',
      required: true,
   })
   phone: string;

   @IsOptional()
   @ApiProperty({
      description: 'dateOfBirth',
      required: false,
   })
   dateOfBirth: Date;

   @IsOptional()
   @ApiProperty({
      description: 'password',
      required: false,
   })
   password: string;

   @ApiProperty({
      type: 'File',
      description: 'profileImage',
      nullable: true,
   })
   @IsOptional()
   profileImage: any;
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
