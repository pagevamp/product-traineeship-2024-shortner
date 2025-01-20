import { Module } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { ShortUrlsController } from '@/short-urls/short-urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([ShortUrl]), UsersModule],
	controllers: [ShortUrlsController],
	providers: [ShortUrlsService],
	exports: [ShortUrlsService],
})
export class ShortUrlsModule {}
