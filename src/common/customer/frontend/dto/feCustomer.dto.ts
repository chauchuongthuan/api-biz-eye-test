import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FeCustomerDto {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   name: string;

   @IsNotEmpty({ message: 'email là bắt buộc!' })
   @ApiProperty()
   email: string;

   @IsOptional()
   @ApiProperty()
   phone: string;

   @IsNotEmpty({ message: 'password là bắt buộc!' })
   @ApiProperty()
   password: string;

   @IsOptional()
   @ApiProperty()
   dateOfBirth: string;

   @IsOptional()
   @ApiProperty()
   gender: string;

   @IsOptional()
   @ApiProperty()
   isSendEmail: boolean;

   @IsOptional()
   @ApiProperty()
   newsSubscribe: number;
}
