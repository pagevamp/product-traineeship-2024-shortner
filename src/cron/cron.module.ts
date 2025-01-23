import { Module } from '@nestjs/common';
import { CronService } from '@/cron/cron.service';
import { ShortUrlsModule } from '@/short-urls/short-urls.module';

@Module({
	imports: [ShortUrlsModule],
	providers: [CronService],
})
export class CronModule {}
