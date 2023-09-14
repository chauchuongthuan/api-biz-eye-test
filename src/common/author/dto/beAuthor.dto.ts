// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BeAuthorDto {
   @IsNotEmpty({ message: 'Tên là bắt buộc!' })
   @ApiProperty()
   name: string;
}
