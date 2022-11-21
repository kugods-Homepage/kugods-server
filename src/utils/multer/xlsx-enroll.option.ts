import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const xlsxEnrollOption = {
  //파일 확장자 처리
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      callback(null, true);
    } else {
      callback(new BadRequestException('.xlsx파일을 업로드해주세요.'), false);
    }
  },
  //메모리에 저장
  storage: memoryStorage(),
};

export default xlsxEnrollOption;
