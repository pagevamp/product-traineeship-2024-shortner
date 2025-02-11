import { errorMessage } from '@/common/messages';
import { Transform } from 'class-transformer';
import { IsDate, MinDate, ValidateIf } from 'class-validator';

export class UpdateShortUrlDto {
	@IsDate()
	@ValidateIf((o) => o.expires_at !== null)
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	@MinDate(new Date(), { message: errorMessage.currentDateValidation })
	expiryDate: Date;
}
