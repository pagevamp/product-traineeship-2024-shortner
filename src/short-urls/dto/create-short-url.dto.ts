import { IsDate, IsOptional, IsUrl, MinDate, ValidateIf } from 'class-validator';
import { errorMessage } from '@/common/messages';
import { Transform } from 'class-transformer';

export class CreateShortUrlDto {
	@IsUrl()
	originalUrl: string;

	@IsOptional()
	@IsDate()
	@ValidateIf((o) => o.expires_at !== null)
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	@MinDate(new Date(), { message: errorMessage.currentDateValidation })
	expiryDate: Date;
}
