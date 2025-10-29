import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { ScrapeUrlsDto } from './dtos/scrape-url.dto';
import { ScrapeResponseDto } from './dtos/scrape-response.dto';
import { ListMediaDto } from './dtos/list-media.dto';
import { ListMediaResponseDto } from './dtos/media-response.dto';

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('scrape')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Submit URLs for scraping',
    description:
      'Queue one or multiple URLs to be scraped for image and video content. Accepts both single URL and array of URLs. Returns immediately with job ID(s).',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Scraping job(s) have been queued',
    type: [ScrapeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid URL(s) provided',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit exceeded',
  })
  async scrapeUrl(
    @Body() body: ScrapeUrlsDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<ScrapeResponseDto[]> {
    const results = await this.scraperService.queueMultipleScrapeJobs(
      body.urls,
      ip,
      userAgent,
    );

    return results.map((result) => ({
      id: result.id,
      sourceUrl: result.sourceUrl,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }));
  }

  @Get('media')
  @ApiOperation({
    summary: 'List all scraped media with pagination',
    description:
      'Retrieve a paginated list of all scraped images and videos. Supports filtering by media type and search text.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media list retrieved successfully',
    type: ListMediaResponseDto,
  })
  async listMedia(@Query() query: ListMediaDto): Promise<ListMediaResponseDto> {
    return this.scraperService.listMedia(query);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get system statistics',
    description:
      'Retrieve comprehensive system statistics including queue metrics, database stats, and system health.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    return this.scraperService.getStatistics();
  }
}
