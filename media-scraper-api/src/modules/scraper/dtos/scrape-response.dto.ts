import { ApiProperty } from '@nestjs/swagger';

export class MediaUrlsDto {
  @ApiProperty({ description: 'List of image URLs', type: [String] })
  images!: string[];

  @ApiProperty({ description: 'List of video URLs', type: [String] })
  videos!: string[];
}

export class ScrapeResponseDto {
  @ApiProperty({ description: 'Unique job ID' })
  id!: string;

  @ApiProperty({ description: 'Source URL that was scraped' })
  sourceUrl!: string;

  @ApiProperty({
    description: 'Status of the scraping job',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status!: string;

  @ApiProperty({ description: 'Page title', required: false })
  pageTitle?: string;

  @ApiProperty({ description: 'Page description', required: false })
  pageDescription?: string;

  @ApiProperty({ description: 'Scraped media URLs', required: false })
  mediaUrls?: MediaUrlsDto;

  @ApiProperty({ description: 'Number of images found', required: false })
  imageCount?: number;

  @ApiProperty({ description: 'Number of videos found', required: false })
  videoCount?: number;

  @ApiProperty({
    description: 'Processing time in milliseconds',
    required: false,
  })
  processingTimeMs?: number;

  @ApiProperty({ description: 'Error message if failed', required: false })
  errorMessage?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
