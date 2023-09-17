import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsExistFileTmp } from 'src/core/validator/IsExistFileTmp';

export class FeSubscriberDto {
   @ApiProperty({
      description: 'email',
   })
   @IsNotEmpty()
   @MaxLength(255)
   email: string;

   @ApiProperty({
      description: 'reCaptchaCode',
   })
   // @IsNotEmpty({ message: 'reCaptchaCode là bắt buộc!' })
   @IsOptional()
   reCaptchaCode: string;
}
