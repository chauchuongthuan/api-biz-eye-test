import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginSocialDto {
   @ApiProperty({
      description: 'accessToken of facebook',
      required: true,
   })
   @IsNotEmpty({ message: 'Mã là bắt buộc' })
   accessToken: string;

   @IsOptional()
   forceLogin: boolean;
}
