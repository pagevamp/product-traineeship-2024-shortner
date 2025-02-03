import { ValidatorConstraint, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { AnalyticsQueryDto } from '@/url-analytics/dto/query-analytics.dto';
import { errorMessage } from '@/common/messages';

@ValidatorConstraint({ name: 'FilterDate', async: false })
export class FilterDate implements ValidatorConstraintInterface {
	validate(endDate: Date, args: ValidationArguments): boolean {
		const { startDate } = args.object as AnalyticsQueryDto;
		if (!startDate || !endDate) return true;
		return endDate >= startDate;
	}

	defaultMessage(): string {
		return errorMessage.queryDateValidation;
	}
}
