import { HttpStatus } from '@nestjs/common';

export class SuccessResponse {
	statusCode: HttpStatus;
	message: string;
	data: unknown;

	constructor(message: string, data: unknown, statusCode = HttpStatus.OK) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}
