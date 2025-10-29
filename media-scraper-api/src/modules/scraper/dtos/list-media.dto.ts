import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MediaTypeFilter } from '../scraper.enum';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/page';

export class ListMediaDto {
  @ApiPropertyOptional({
    description: 'Page number (starting from 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Filter by media type',
    enum: MediaTypeFilter,
    example: MediaTypeFilter.ALL,
    default: MediaTypeFilter.ALL,
  })
  @IsOptional()
  @IsEnum(MediaTypeFilter)
  type?: MediaTypeFilter = MediaTypeFilter.ALL;

  @ApiPropertyOptional({
    description: 'Search text to filter by URL or page title',
    example: 'example',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
