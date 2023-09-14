import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
   @IsNotEmpty({ message: 'Email là bắt buộc!' })
   @ApiProperty()
   email: string;

   @IsNotEmpty({ message: 'Mật khẩu là bắt buộc!' })
   @ApiProperty()
   password: string;
}
