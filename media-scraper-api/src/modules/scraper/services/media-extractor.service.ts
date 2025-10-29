import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { ScrapeResult } from '../interfaces/scraper.interface';

@Injectable()
export class MediaExtractorService implements OnModuleDestroy {
  private readonly logger = new Logger(MediaExtractorService.name);
  private browser: Browser | null = null;
  private readonly maxConcurrentPages = 5;
  private activePagesCount = 0;

  private async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      this.logger.log('Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      this.logger.log('Puppeteer browser initialized successfully');
    }
    return this.browser;
  }

  private async createPage(): Promise<Page> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    // Block unnecessary resources to save bandwidth and memory
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      // Block more resources for memory efficiency
      const blockedResources = ['font', 'stylesheet', 'media', 'other'];

      if (blockedResources.includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Set timeout
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    return page;
  }

  async scrapeMediaFromUrl(url: string): Promise<ScrapeResult> {
    // Wait if too many pages are active
    while (this.activePagesCount >= this.maxConcurrentPages) {
      this.logger.debug(
        `Waiting for available page slot (${this.activePagesCount}/${this.maxConcurrentPages})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    let page: Page | null = null;

    try {
      this.activePagesCount++;
      page = await this.createPage();

      this.logger.log(`Navigating to ${url}`);
      await page.goto(url, {
        waitUntil: 'domcontentloaded', // Changed from networkidle2 for faster processing
        timeout: 20000, // Reduced timeout
      });

      // Wait for dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Extract media URLs and metadata using browser context
      const result = await page.evaluate(() => {
        const images = new Set<string>();
        const videos = new Set<string>();

        // Helper to validate and add image URLs
        const addImage = (src: string | null) => {
          if (!src) return;
          try {
            const url = new URL(src, window.location.href);
            const pathname = url.pathname.toLowerCase();
            const imageExtensions = [
              '.jpg',
              '.jpeg',
              '.png',
              '.gif',
              '.webp',
              '.svg',
              '.bmp',
              '.ico',
            ];
            if (
              imageExtensions.some((ext) => pathname.includes(ext)) ||
              url.protocol === 'data:'
            ) {
              images.add(url.href);
            }
          } catch {
            // Invalid URL, skip
          }
        };

        // Helper to validate and add video URLs
        const addVideo = (src: string | null) => {
          if (!src) return;
          try {
            const url = new URL(src, window.location.href);
            const pathname = url.pathname.toLowerCase();
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
            if (
              videoExtensions.some((ext) => pathname.includes(ext)) ||
              url.href.includes('youtube.com') ||
              url.href.includes('vimeo.com') ||
              url.href.includes('youtu.be')
            ) {
              videos.add(url.href);
            }
          } catch {
            // Invalid URL, skip
          }
        };

        // Extract images from img tags
        document.querySelectorAll('img').forEach((img) => {
          addImage(img.src);
          addImage(img.getAttribute('data-src'));
          addImage(img.getAttribute('data-lazy-src'));
          addImage(img.getAttribute('data-original'));

          // Handle srcset
          const srcset = img.getAttribute('srcset');
          if (srcset) {
            srcset.split(',').forEach((entry) => {
              const url = entry.trim().split(' ')[0];
              addImage(url);
            });
          }
        });

        // Extract images from picture source tags
        document.querySelectorAll('picture source').forEach((source) => {
          addImage(source.getAttribute('srcset'));
        });

        // Extract Open Graph and Twitter Card images
        document
          .querySelectorAll(
            'meta[property="og:image"], meta[name="twitter:image"]',
          )
          .forEach((meta) => {
            addImage(meta.getAttribute('content'));
          });

        // Extract videos from video tags
        document.querySelectorAll('video').forEach((video) => {
          addVideo(video.src);
          addVideo(video.getAttribute('data-src'));

          // Check source tags within video
          video.querySelectorAll('source').forEach((source) => {
            addVideo(source.src);
            addVideo(source.getAttribute('data-src'));
          });
        });

        // Extract YouTube/Vimeo/embedded videos from iframes
        document.querySelectorAll('iframe').forEach((iframe) => {
          const src = iframe.src;
          if (
            src &&
            (src.includes('youtube.com') ||
              src.includes('vimeo.com') ||
              src.includes('youtu.be'))
          ) {
            addVideo(src);
          }
        });

        // Extract background images from elements
        document
          .querySelectorAll('[style*="background-image"]')
          .forEach((el) => {
            const style = (el as HTMLElement).style.backgroundImage;
            const matches = style.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (matches && matches[1]) {
              addImage(matches[1]);
            }
          });

        // Extract metadata
        const title =
          document
            .querySelector('meta[property="og:title"]')
            ?.getAttribute('content') ||
          document
            .querySelector('meta[name="twitter:title"]')
            ?.getAttribute('content') ||
          document.title ||
          undefined;

        const description =
          document
            .querySelector('meta[property="og:description"]')
            ?.getAttribute('content') ||
          document
            .querySelector('meta[name="twitter:description"]')
            ?.getAttribute('content') ||
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') ||
          undefined;

        return {
          images: Array.from(images),
          videos: Array.from(videos),
          title,
          description,
        };
      });

      this.logger.log(
        `Scraped ${result.images.length} images and ${result.videos.length} videos from ${url}`,
      );

      return result;
    } catch (error: any) {
      this.logger.error(
        `Failed to scrape ${url}: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      if (page) {
        await page.close().catch((err) => {
          this.logger.warn(`Error closing page: ${err.message}`);
        });
      }
      this.activePagesCount--;
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      this.logger.log('Closing Puppeteer browser...');
      await this.browser.close();
      this.browser = null;
    }
  }
}
