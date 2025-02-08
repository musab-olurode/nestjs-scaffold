import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OTP } from '@/app/otp/entities/otp.entity';

import { OtpService } from '@/app/otp/otp.service';

@Module({
	imports: [TypeOrmModule.forFeature([OTP])],
	providers: [OtpService],
	exports: [OtpService],
})
export class OtpModule {}
