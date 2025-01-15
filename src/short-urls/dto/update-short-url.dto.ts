import { PickType } from '@nestjs/mapped-types';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';

export class UpdateShortUrlDto extends PickType(CreateShortUrlDto, ['expiryDate'] as const) {}
