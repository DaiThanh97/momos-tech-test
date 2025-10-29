import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ScraperRepository } from './scraper.repository';
import { ScrapedMediaEntity } from './entities/scraped-media.entity';
import { ScrapeJobData } from './interfaces/scraper.interface';
import { MediaExtractorService } from './services/media-extractor.service';
import {
  MediaTypeFilter,
  ScraperQueue,
  ScraperQueueName,
  ScrapingStatus,
} from './scraper.enum';
import { ScraperError } from '../../common/errors/base.error';
import { ListMediaDto } from './dtos/list-media.dto';
import { ListMediaResponseDto, MediaItemDto } from './dtos/media-response.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/page';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly scraperRepository: ScraperRepository,
    @InjectQueue(ScraperQueue.SCRAPER)
    private readonly scraperQueue: Queue,
    private readonly mediaExtractorService: MediaExtractorService,
  ) {}

  async queueMultipleScrapeJobs(
    urls: string[],
    requestIp?: string,
    userAgent?: string,
  ): Promise<ScrapedMediaEntity[]> {
    this.logger.log(`Queuing ${urls.length} scraping jobs`);

    // Create all database records in a single transaction
    const scrapedMediaEntries = urls.map((url) =>
      this.scraperRepository.create({
        sourceUrl: url,
        status: ScrapingStatus.PENDING,
        requestIp,
        userAgent,
        mediaUrls: { images: [], videos: [] },
        imageCount: 0,
        videoCount: 0,
      }),
    );

    const savedEntries = await this.scraperRepository.save(scrapedMediaEntries);

    // Queue all jobs
    const jobPromises = savedEntries.map((entry) => {
      const jobData: ScrapeJobData = {
        url: entry.sourceUrl,
        requestIp,
        userAgent,
        jobId: entry.id,
      };
      return this.scraperQueue.add(ScraperQueueName.SCRAPE_URL, jobData);
    });

    await Promise.all(jobPromises);

    this.logger.log(`Successfully queued ${savedEntries.length} scraping jobs`);

    return savedEntries;
  }

  async processScrapeJob(jobData: ScrapeJobData): Promise<void> {
    const startTime = Date.now();
    const { url, jobId } = jobData;

    if (!jobId) {
      throw new ScraperError('Job ID is required');
    }

    try {
      // Update status to processing
      await this.scraperRepository.update(jobId, {
        status: ScrapingStatus.PROCESSING,
      });

      this.logger.log(`Processing scraping job ${jobId} for URL: ${url}`);

      // Scrape using Puppeteer
      const result = await this.mediaExtractorService.scrapeMediaFromUrl(url);
      const mediaUrls = {
        images: result.images,
        videos: result.videos,
      };
      const processingTime = Date.now() - startTime;

      // Update database with results
      await this.scraperRepository.update(jobId, {
        status: ScrapingStatus.COMPLETED,
        mediaUrls,
        imageCount: result.images.length,
        videoCount: result.videos.length,
        pageTitle: result.title,
        pageDescription: result.description,
        processingTimeMs: processingTime,
        errorMessage: undefined,
      });

      this.logger.log(
        `Completed scraping job ${jobId} - Found ${mediaUrls.images.length} images and ${mediaUrls.videos.length} videos in ${processingTime}ms`,
      );
    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error.message || 'Unknown error occurred';

      this.logger.error(
        `Failed scraping job ${jobId}: ${errorMessage}`,
        error.stack,
      );

      // Update database with failed status
      await this.scraperRepository.update(jobId, {
        status: ScrapingStatus.FAILED,
        errorMessage,
        processingTimeMs: processingTime,
      });

      throw error;
    }
  }

  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.scraperQueue.getWaitingCount(),
      this.scraperQueue.getActiveCount(),
      this.scraperQueue.getCompletedCount(),
      this.scraperQueue.getFailedCount(),
      this.scraperQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }

  async getStatistics() {
    // Get queue statistics
    const queueStats = await this.getQueueStats();

    // Get database statistics
    const [totalJobs, pendingJobs, processingJobs, completedJobs, failedJobs] =
      await Promise.all([
        this.scraperRepository.count(),
        this.scraperRepository.count({
          where: { status: ScrapingStatus.PENDING },
        }),
        this.scraperRepository.count({
          where: { status: ScrapingStatus.PROCESSING },
        }),
        this.scraperRepository.count({
          where: { status: ScrapingStatus.COMPLETED },
        }),
        this.scraperRepository.count({
          where: { status: ScrapingStatus.FAILED },
        }),
      ]);

    // Calculate average processing time for completed jobs
    const completedJobsWithTime = await this.scraperRepository.find({
      where: { status: ScrapingStatus.COMPLETED },
      select: ['processingTimeMs'],
      take: 1000, // Last 1000 completed jobs
      order: { createdAt: 'DESC' },
    });

    const avgProcessingTime =
      completedJobsWithTime.length > 0
        ? Math.round(
            completedJobsWithTime.reduce(
              (sum, job) => sum + (job.processingTimeMs || 0),
              0,
            ) / completedJobsWithTime.length,
          )
        : 0;

    // Calculate success rate
    const successRate =
      totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(2) : 0;

    // System health metrics
    const totalConcurrentLoad = queueStats.waiting + queueStats.active;
    const isHealthy = totalConcurrentLoad < 10000 && queueStats.active <= 10;

    return {
      timestamp: new Date().toISOString(),
      queue: {
        waiting: queueStats.waiting,
        active: queueStats.active,
        completed: queueStats.completed,
        failed: queueStats.failed,
        delayed: queueStats.delayed,
        total: totalConcurrentLoad,
      },
      database: {
        totalJobs,
        pending: pendingJobs,
        processing: processingJobs,
        completed: completedJobs,
        failed: failedJobs,
        successRate: `${successRate}%`,
      },
      performance: {
        avgProcessingTimeMs: avgProcessingTime,
        jobsPerMinute:
          avgProcessingTime > 0 ? Math.round(60000 / avgProcessingTime) : 0,
      },
      health: {
        status: isHealthy ? 'healthy' : 'degraded',
        message: isHealthy
          ? 'System operating normally'
          : 'High load detected - queue backlog building',
        concurrentLoad: totalConcurrentLoad,
      },
    };
  }

  async listMedia(listMediaDto: ListMediaDto): Promise<ListMediaResponseDto> {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      type = MediaTypeFilter.ALL,
      search,
    } = listMediaDto;
    const skip = (page - 1) * limit;

    // Build query
    const query = this.scraperRepository
      .createQueryBuilder('scraped_media')
      .where('scraped_media.status = :status', {
        status: ScrapingStatus.COMPLETED,
      });

    if (search) {
      query.andWhere(
        '(scraped_media.pageDescription LIKE :search OR scraped_media.pageTitle LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const allRecords = await query
      .orderBy('scraped_media.createdAt', 'DESC')
      .getMany();

    const allMedia: MediaItemDto[] = [];

    allRecords.forEach((record) => {
      if (
        record.mediaUrls?.images &&
        (type === 'image' || type === 'all' || !type)
      ) {
        record.mediaUrls.images.forEach((imageUrl) => {
          allMedia.push({
            url: imageUrl,
            type: 'image',
            sourceUrl: record.sourceUrl,
            pageTitle: record.pageTitle,
            jobId: record.id,
            scrapedAt: record.createdAt,
          });
        });
      }

      if (
        record.mediaUrls?.videos &&
        (type === 'video' || type === 'all' || !type)
      ) {
        record.mediaUrls.videos.forEach((videoUrl) => {
          allMedia.push({
            url: videoUrl,
            type: 'video',
            sourceUrl: record.sourceUrl,
            pageTitle: record.pageTitle,
            jobId: record.id,
            scrapedAt: record.createdAt,
          });
        });
      }
    });

    const totalItems = allMedia.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = allMedia.slice(skip, skip + limit);

    return {
      data: paginatedData,
      meta: {
        currentPage: page,
        perPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
