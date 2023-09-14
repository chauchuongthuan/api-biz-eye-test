import { IsNotEmpty } from 'class-validator';
export class RefreshTokenDto {
   @IsNotEmpty({ message: 'Mã là bắt buộc!' })
   refreshToken: string;
}
