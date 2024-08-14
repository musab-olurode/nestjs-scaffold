import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get('mail.smtpHost'),
					port: parseInt(config.get('mail.smtpPort')),
					secure: config.get('nodeEnv') === 'production',
					auth: config.get('nodeEnv') === 'production' && {
						user: config.get('mail.smtpEmail'),
						pass: config.get('mail.smtpPassword'),
					},
					tls: {
						rejectUnauthorized: config.get('nodeEnv') === 'production',
					},
				},
				defaults: {
					from: `"${config.get('mail.fromName')}" <${config.get('mail.fromEmail')}>`,
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
