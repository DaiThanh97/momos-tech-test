import { ApiProperty } from '@nestjs/swagger';

export class MediaItemDto {
  @ApiProperty({ description: 'Media URL' })
  url!: string;

  @ApiProperty({ description: 'Media type', enum: ['image', 'video'] })
  type!: 'image' | 'video';

  @ApiProperty({ description: 'Source URL where media was found' })
  sourceUrl!: string;

  @ApiProperty({ description: 'Page title', required: false })
  pageTitle?: string;

  @ApiProperty({ description: 'Job ID' })
  jobId!: string;

  @ApiProperty({ description: 'Date scraped' })
  scrapedAt!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number' })
  currentPage!: number;

  @ApiProperty({ description: 'Items per page' })
  perPage!: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;

  @ApiProperty({ description: 'Has next page' })
  hasNextPage!: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPreviousPage!: boolean;
}

export class ListMediaResponseDto {
  @ApiProperty({ description: 'Media items', type: [MediaItemDto] })
  data!: MediaItemDto[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta!: PaginationMetaDto;
}
