import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';
import { EnvironmentVariables } from '../validation/env.validation';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (
				config: ConfigService<EnvironmentVariables, true>,
			) => ({
				transport: {
					host: config.get('SMTP_HOST'),
					port: config.get<number>('SMTP_PORT'),
					secure: config.get('NODE_ENV') === 'production',
					auth: config.get('NODE_ENV') === 'production' && {
						user: config.get('SMTP_EMAIL'),
						pass: config.get('SMTP_PASSWORD'),
					},
					tls: {
						rejectUnauthorized: config.get('NODE_ENV') === 'production',
					},
				},
				defaults: {
					from: `"${config.get('FROM_NAME')}" <${config.get('FROM_EMAIL')}>`,
				},
				template: {
					dir: join(__dirname, 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
