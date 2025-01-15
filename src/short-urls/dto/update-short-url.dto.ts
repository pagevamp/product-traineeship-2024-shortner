import { PartialType } from '@nestjs/mapped-types';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';

export class UpdateShortUrlDto extends PartialType(CreateShortUrlDto) {}