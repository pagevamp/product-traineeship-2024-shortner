import { Module } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { ShortUrlsController } from '@/short-urls/short-urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ShortUrl])],
	controllers: [ShortUrlsController],
	providers: [ShortUrlsService],
})
export class ShortUrlsModule {}
