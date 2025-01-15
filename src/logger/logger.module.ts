import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '@/logger/logger.service';
import { loggerConfig } from '@/logger/config/logger.config';

@Global()
@Module({
	imports: [WinstonModule.forRoot(loggerConfig)],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class LoggerModule {}
