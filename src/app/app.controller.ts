import { Controller, Get } from '@nestjs/common';

import { Public } from '@/decorators/public.decorator';

import { AppService } from '@/app/app.service';

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
