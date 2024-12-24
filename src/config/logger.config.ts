import { format, transports } from 'winston';
const isProduction = process.env.APP_ENV === 'production';
export const loggerConfig = {
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ level, message, timestamp }) => {
			return `${timestamp} [${level}]: ${message}`;
		}),
	),
	transports: isProduction
		? [
				new transports.File({ filename: 'logs/errors.log', level: 'error' }),
				new transports.File({ filename: 'logs/all.log' }),
			]
		: [new transports.Console({ format: format.combine(format.colorize({ all: true })) })],
};
