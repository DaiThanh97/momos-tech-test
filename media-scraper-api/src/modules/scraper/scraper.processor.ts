import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ScraperService } from './scraper.service';
import { ScrapeJobData } from './interfaces/scraper.interface';
import { ScraperQueue, ScraperQueueName } from './scraper.enum';

@Processor(ScraperQueue.SCRAPER)
export class ScraperProcessor {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(private readonly scraperService: ScraperService) {}

  @Process({
    name: ScraperQueueName.SCRAPE_URL,
    concurrency: 10,
  })
  async handleScrapeJob(job: Job<ScrapeJobData>) {
    const { url, jobId } = job.data;
    this.logger.log(
      `[Job ${job.id}] Starting to scrape URL: ${url} (DB ID: ${jobId})`,
    );

    try {
      await this.scraperService.processScrapeJob(job.data);
      this.logger.log(`[Job ${job.id}] Successfully completed scraping`);
      return { success: true, jobId };
    } catch (error: any) {
      this.logger.error(
        `[Job ${job.id}] Failed to scrape: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
