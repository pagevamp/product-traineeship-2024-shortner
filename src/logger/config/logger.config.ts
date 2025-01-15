import { format, transports } from 'winston';
import { env } from '@/config/env.config';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(env.LOGTAIL_TOKEN as string);

const isProduction = env.NODE_ENV === 'production';
export const loggerConfig = {
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ level, message, timestamp }) => {
			return `${timestamp} [${level}]: ${message}`;
		}),
	),
	transports: isProduction
		? [new LogtailTransport(logtail)]
		: [new transports.Console({ format: format.combine(format.colorize({ all: true })) })],
};
