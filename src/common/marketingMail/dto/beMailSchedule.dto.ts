// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExistFileTmp } from '@core/validator/IsExistFileTmp';
import { Prop } from '@nestjs/mongoose';

export class BeMailScheduleDto {
   @ApiProperty({
      description: 'interests',
   })
   @IsOptional()
   interests: Array<string> = [];

   @ApiProperty({
      description: 'assigned',
   })
   @IsOptional()
   assigned: Array<string> = [];

   @ApiProperty({
      description: 'Tên',
   })
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   name: string;

   @ApiProperty()
   @IsNotEmpty({ message: 'Ngày gửi là bắt buộc!' })
   sendAt: string;

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
