import { LoggerService } from '@/logger/logger.service';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';
import { errorMessage } from '@/common/messages';

@Processor('urlAnalyticsQueue')
export class URLAnalyticsQueue extends WorkerHost {
	constructor(
		private logger: LoggerService,
		private analyticsService: UrlAnalyticsService,
	) {
		super();
	}

	async process(job: Job): Promise<void> {
		await this.analyticsService.createAnalytics(job.data);
	}

	@OnWorkerEvent('active')
	onActive(job: Job): void {
		this.logger.log(`Processing job ${job.id} of type ${job.name} `);
	}
	@OnWorkerEvent('completed')
	onComplete(job: Job): void {
		this.logger.log(`Job with id ${job.id} of type ${job.name} has been completed`);
	}

	@OnWorkerEvent('failed')
	async onFailed(job: Job, err: Error): Promise<void> {
		this.logger.error(`${errorMessage.jobFailed} ${job.id} of type ${job.name} \n ${err.message}`);
		if (job.attemptsMade >= (job.opts.attempts || 5)) {
			this.logger.log(`${errorMessage.jobRemoved} ${job.id}`);
			job.remove();
		}
	}
}
