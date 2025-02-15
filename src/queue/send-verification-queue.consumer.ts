import { UsersService } from '@/users/users.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LoggerService } from '@/logger/logger.service';
import { errorMessage } from '@/common/messages';

@Processor('sendVerificationMail')
export class VerificationEmailConsumer extends WorkerHost {
	constructor(
		private readonly logger: LoggerService,
		private readonly userService: UsersService,
	) {
		super();
	}

	async process(job: Job): Promise<void> {
		await this.userService.sendEmailVerification({ email: job.data.email });
	}

	@OnWorkerEvent('failed')
	async onFailed(job: Job, err: Error): Promise<void> {
		this.logger.error(`${errorMessage.jobFailed} ${job.id} of type ${job.name} \n ${err.message}`);
		if (job.attemptsMade >= (job.opts.attempts || 5)) {
			this.logger.error(`${errorMessage.emailSendFailed} ${job.data.email}`);
			this.logger.error(`${errorMessage.jobRemoved} ${job.id}`);
			job.remove();
		}
	}
}
