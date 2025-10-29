import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { ScraperService } from './scraper.service';
import { ScraperRepository } from './scraper.repository';
import { MediaExtractorService } from './services/media-extractor.service';
import { ScrapingStatus } from './scraper.enum';

describe('ScraperService', () => {
  let service: ScraperService;
  let repository: jest.Mocked<ScraperRepository>;
  let queue: any;
  let mediaExtractor: MediaExtractorService;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
      getStatistics: jest.fn(),
    };

    const mockQueue = {
      add: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScraperService,
        {
          provide: ScraperRepository,
          useValue: mockRepository,
        },
        {
          provide: getQueueToken('scraper'),
          useValue: mockQueue,
        },
        MediaExtractorService,
      ],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    repository = module.get(ScraperRepository);
    queue = module.get(getQueueToken('scraper'));
    mediaExtractor = module.get<MediaExtractorService>(MediaExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queueScrapeJob', () => {
    it('should create database record and queue job', async () => {
      const url = 'https://example.com';
      const mockScrapedMedia = {
        id: 'test-id',
        sourceUrl: url,
        status: ScrapingStatus.PENDING,
        mediaUrls: { images: [], videos: [] },
        imageCount: 0,
        videoCount: 0,
      };

      repository.create.mockReturnValue(mockScrapedMedia as any);
      repository.save.mockResolvedValue(mockScrapedMedia as any);

      const result = await service.queueScrapeJob(url);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceUrl: url,
          status: ScrapingStatus.PENDING,
        }),
      );
      expect(repository.save).toHaveBeenCalled();
      expect(queue.add).toHaveBeenCalledWith(
        'scrape-url',
        expect.objectContaining({
          url,
          jobId: 'test-id',
        }),
        expect.any(Object),
      );
      expect(result).toEqual(mockScrapedMedia);
    });
  });

  describe('getJobStatus', () => {
    it('should return job by id', async () => {
      const mockJob = {
        id: 'test-id',
        sourceUrl: 'https://example.com',
        status: ScrapingStatus.COMPLETED,
      };

      repository.findOne.mockResolvedValue(mockJob as any);

      const result = await service.getJobStatus('test-id');

      expect(repository.findOne).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockJob);
    });
  });

  describe('getStatistics', () => {
    it('should return database statistics', async () => {
      const mockStats = {
        total: 100,
        completed: 80,
        failed: 10,
        pending: 5,
        processing: 5,
      };

      repository.getStatistics.mockResolvedValue(mockStats);

      const result = await service.getStatistics();

      expect(repository.getStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      const result = await service.getQueueStats();

      expect(result).toEqual({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      });
    });
  });
});
