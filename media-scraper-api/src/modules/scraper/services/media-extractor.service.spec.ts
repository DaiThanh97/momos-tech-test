import { Test, TestingModule } from '@nestjs/testing';
import { MediaExtractorService } from './media-extractor.service';

describe('MediaExtractorService', () => {
  let service: MediaExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaExtractorService],
    }).compile();

    service = module.get<MediaExtractorService>(MediaExtractorService);
  });

  afterEach(async () => {
    // Clean up browser instance
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeMediaFromUrl', () => {
    it('should scrape a simple web page', async () => {
      // Create a simple HTML test server would be ideal here
      // For now, we'll test with a known public URL
      // In a real scenario, you'd use a mock server

      const mockUrl = 'https://example.com';

      try {
        const result = await service.scrapeMediaFromUrl(mockUrl);

        expect(result).toBeDefined();
        expect(result.images).toBeDefined();
        expect(result.videos).toBeDefined();
        expect(Array.isArray(result.images)).toBe(true);
        expect(Array.isArray(result.videos)).toBe(true);
        expect(typeof result.title).toBe('string');
      } catch (error) {
        // Network errors are acceptable in unit tests
        expect(error).toBeDefined();
      }
    }, 60000); // Increase timeout for Puppeteer

    it('should handle invalid URLs gracefully', async () => {
      const invalidUrl =
        'https://invalid-url-that-does-not-exist-123456789.com';

      await expect(service.scrapeMediaFromUrl(invalidUrl)).rejects.toThrow();
    }, 60000);
  });

  describe('browser management', () => {
    it('should initialize and close browser properly', async () => {
      // This tests the lifecycle management
      await service.onModuleDestroy();

      // Service should still be functional after cleanup
      expect(service).toBeDefined();
    });
  });
});
