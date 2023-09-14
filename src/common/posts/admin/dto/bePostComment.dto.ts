import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class BePostCommentDto {
   @ApiProperty({
      type: String,
      description: 'content',
      required: true,
   })
   @IsNotEmpty()
   content: string;

   @ApiProperty({
      description: 'post',
      required: true,
   })
   @IsNotEmpty({ message: 'Bài viết là bắt buộc!' })
   post: string;
}
