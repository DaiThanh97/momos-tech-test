import {
  IsUrl,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapeUrlsDto {
  @ApiProperty({
    description: 'Array of URLs to scrape for media content',
    example: ['https://example.com', 'https://another-site.com'],
    type: [String],
    minItems: 1,
    maxItems: 50,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one URL is required' })
  @ArrayMaxSize(50, { message: 'Maximum 50 URLs allowed per request' })
  @IsUrl({}, { each: true, message: 'Each URL must be valid' })
  @IsNotEmpty({ each: true })
  urls!: string[];
}
