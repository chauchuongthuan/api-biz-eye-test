import { Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';

import { BeGptDto } from '@common/chatgpt/admin/dto/beGpt.dto';
import { CHATTYPES } from '@src/core/constants/chatgtp.enum';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { History } from '@src/schemas/history/history.schema';
import { HelperService } from '@src/core/services/helper.service';
import { query } from 'express';

@Injectable()
export class GptService {
   constructor(
      private readonly httpService: HttpService,
      @InjectModel(History.name) private history: PaginateModel<History>,
      private helper: HelperService,
   ) {}

   async chat(dto: BeGptDto) {
      let promptText = '';
      let dataTypes = '';
      switch (dto.dataTypes) {
         case CHATTYPES.AW:
            promptText = 'Viết bài báo';
            dataTypes = 'Viết bài báo';
            break;
         case CHATTYPES.IMPROVE:
            promptText = 'cải thiện văn bản';
            dataTypes = 'cải thiện văn bản';
            break;
         case CHATTYPES.TRANSLATE:
            promptText = ` Dịch văn bản sang tiếng ${dto.language}`;
            dataTypes = promptText;
            break;
         case CHATTYPES.QA:
            promptText = '';
            dataTypes = 'Trả lời câu hỏi';
            break;
         case CHATTYPES.META:
            promptText = `
            Trong “Mô tả meta”, tạo mô tả meta dựa trên CTR từ 175 đến 200 ký tự cho trang này dựa trên dữ liệu được cung cấp. Tạo mô tả thu hút sự chú ý và khuyến khích nhấp chuột. Vui lòng không thêm dấu ngoặc kép xung quanh nội dung.
            - Tạo danh sách Câu hỏi thường gặp liên quan đến từ khóa chính, hiển thị chúng dưới dạng danh sách không có thứ tự và gắn nhãn chúng dưới tiêu đề “Câu hỏi thường gặp”.
            - Chuẩn bị một danh sách không có thứ tự các truy vấn tìm kiếm có liên quan được kết nối với từ khóa chính và đặt tiêu đề cho phần này là “Các truy vấn có liên quan”.
            - Liệt kê các từ khóa đuôi dài chính đáng để xếp hạng do thiếu nội dung chất lượng ở các vị trí hàng đầu, theo Nguyên tắc chất lượng gần đây của Google và các nỗ lực SEO trên trang. Chia sẻ danh sách này dưới dạng danh sách không có thứ tự và đặt tên là “Từ khóa đuôi dài”.
            - Đối chiếu 10 đến 15 từ khóa hàng đầu và kết hợp chúng vào danh sách đánh dấu có cấu trúc sau: Từ khóa. Biểu thị phần này bằng “Từ khóa”..
            - Cuối cùng, tạo một danh sách không theo thứ tự gồm 10 thực thể SEO áp dụng cho từ khóa chính và gắn nhãn chúng là “Thực thể”.
            
            Hãy nhớ rằng, người đọc cuối cùng sẽ thấy nội dung có ích, có giá trị ngay lập tức và dễ đọc. Kế hoạch của bạn nên thu hút các nhấp chuột và nhanh chóng trả lời ý định của người tìm kiếm. Duy trì sự sáng tạo và sự chú ý của bạn đến từng chi tiết trong khi tuân thủ tất cả các hướng dẫn và yêu cầu cụ thể.
            `;
            dataTypes = 'Đánh giá SEO';
            break;

         default:
            break;
      }
      console.log(`${dto.message} - ${promptText}`);
      const data = {
         model: 'openai/gpt-4-32k',

         messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: `${dto.message} - ${promptText}` },
         ],
      };
      const startTime = Date.now(); // Record the start time

      return await firstValueFrom(
         this.httpService.request({
            url: `https://openrouter.ai/api/v1/chat/completions`,

            method: 'POST',

            headers: {
               Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
               'HTTP-Referer': 'https://digitop.vn',
               'X-Title': 'TOBICMS',
            },

            data,
         }),
      )
         .then(async (res) => {
            if (res.status == 200) {
               // Save history to local
               const endTime = Date.now(); // Record the end time

               const responseTime = (endTime - startTime) / 1000;
               console.log(res.data?.choices[0]?.message);
               const answer = res.data?.choices[0]?.message.content;
               const questionNon = await this.helper.nonAccentVietnamese(dto.message);
               const question = dto.message;
               new this.history({
                  answer,
                  questionNon,
                  question,
                  dataTypes,
                  responseTime,
               }).save();
               return { status: true, data: res.data?.choices[0]?.message };
            }

            return { status: false };
         })

         .catch((err: Error) => {
            console.log(err);

            return { status: false, message: err.message };
         });
   }
}
