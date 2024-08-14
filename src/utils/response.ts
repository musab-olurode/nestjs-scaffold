import { HttpStatus } from '@nestjs/common';

export class SuccessResponse {
	statusCode: HttpStatus;
	message: string;
	data: any;

	constructor(message: string, data: any, statusCode = HttpStatus.OK) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}
