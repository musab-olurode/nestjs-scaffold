import { Controller, Get } from '@nestjs/common';

import { AppService } from '@/app/app.service';

import { Public } from '@/app/auth/decorators';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Public()
	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Public()
	@Get('/healthcheck')
	healthCheck() {
		return 'OK';
	}
}
