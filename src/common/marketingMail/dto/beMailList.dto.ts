// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { Prop } from '@nestjs/mongoose';

export class BeMailListDto {
   @ApiProperty({
      description: 'interests',
   })
   @IsOptional()
   interests: Array<string> = [];

   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty({
      description: 'Tên',
   })
   name: string;

   @IsNotEmpty({ message: 'Email là bắt buộc!' })
   @ApiProperty({
      description: 'email',
   })
   email: string;

   @ApiProperty({
      description: 'status',
   })
   @IsOptional()
   status: boolean;
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
