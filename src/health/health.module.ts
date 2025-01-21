import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerService } from '@/logger/logger.service';

@Module({
	imports: [
		TerminusModule.forRoot({
			logger: LoggerService,
		}),
	],
	controllers: [HealthController],
})
export class HealthModule {}
