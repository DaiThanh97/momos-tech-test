import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ScraperProcessor } from './scraper.processor';
import { ScraperRepository } from './scraper.repository';
import { MediaExtractorService } from './services/media-extractor.service';
import { ScraperQueue } from './scraper.enum';
import { ScrapedMediaEntity } from './entities/scraped-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrapedMediaEntity]),
    BullModule.registerQueue({
      name: ScraperQueue.SCRAPER,
    }),
  ],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    ScraperProcessor,
    MediaExtractorService,
    ScraperRepository,
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
