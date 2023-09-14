import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@src/core/constants/post.enum';
import { IsIn, IsNotEmpty } from 'class-validator';

export class ChangeStatusDto {
   @ApiProperty({
      description: 'id',
   })
   @IsNotEmpty()
   id: string;

   @ApiProperty({
      type: Number,
      description: 'status',
      required: true,
   })
   @IsNotEmpty({ message: 'Trạng thái là bắt buộc!' })
   @IsIn(
      Object.keys(StatusEnum)
         .map((k) => StatusEnum[k].toString())
         .filter((k) => parseInt(k)),
   )
   status: number;
}
