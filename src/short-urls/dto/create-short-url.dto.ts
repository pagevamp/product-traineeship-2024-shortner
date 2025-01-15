import { IsDate, IsOptional, IsUrl, MinDate, ValidateIf } from 'class-validator';
import { errorMessage } from '@/common/messages';

export class CreateShortUrlDto {
	@IsUrl()
	originalUrl: string;

	@IsOptional()
	@IsDate()
	@ValidateIf((o) => o.expires_at !== null)
	@MinDate(new Date(), { message: errorMessage.currentDateValidation })
	expiaryDate: Date;
}
