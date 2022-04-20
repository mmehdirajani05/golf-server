import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { MessageText } from 'src/constants/messages';

@Controller('base')
export class BaseController {

  protected OKResponse = (data: any) => {
		return  {
			code: HttpStatus.OK,
			message: MessageText.success,
			...data
		};
	};
}
