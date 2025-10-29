import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ScrapingStatus } from '../scraper.enum';

@Entity('scraped_media')
@Index(['status'])
@Index(['createdAt'])
export class ScrapedMediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 2048 })
  sourceUrl!: string;

  @Column({ type: 'text', nullable: true })
  pageTitle?: string;

  @Column({ type: 'text', nullable: true })
  pageDescription?: string;

  @Column({ type: 'json', nullable: true })
  mediaUrls!: {
    images: string[];
    videos: string[];
  };

  @Column({ type: 'int', default: 0 })
  imageCount!: number;

  @Column({ type: 'int', default: 0 })
  videoCount!: number;

  @Column({
    type: 'enum',
    enum: ScrapingStatus,
    default: ScrapingStatus.PENDING,
  })
  status!: ScrapingStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'int', nullable: true })
  processingTimeMs?: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  requestIp?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
