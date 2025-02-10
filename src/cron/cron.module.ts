import { Module } from '@nestjs/common';
import { CronService } from '@/cron/cron.service';
import { ShortUrlsModule } from '@/short-urls/short-urls.module';
import { VerificationModule } from '@/verification/verification.module';

@Module({
	imports: [ShortUrlsModule, VerificationModule],
	providers: [CronService],
})
export class CronModule {}
