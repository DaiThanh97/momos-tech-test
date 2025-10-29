import { DataSource, Repository } from 'typeorm';
import { ScrapedMediaEntity } from './entities/scraped-media.entity';
import { ScrapingStatus } from './scraper.enum';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ScraperRepository extends Repository<ScrapedMediaEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(ScrapedMediaEntity, dataSource.manager);
  }

  async findByStatus(status: ScrapingStatus): Promise<ScrapedMediaEntity[]> {
    return this.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySourceUrl(sourceUrl: string): Promise<ScrapedMediaEntity[]> {
    return this.find({
      where: { sourceUrl },
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics(): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
  }> {
    const [total, completed, failed, pending, processing] = await Promise.all([
      this.count(),
      this.count({ where: { status: ScrapingStatus.COMPLETED } }),
      this.count({ where: { status: ScrapingStatus.FAILED } }),
      this.count({ where: { status: ScrapingStatus.PENDING } }),
      this.count({ where: { status: ScrapingStatus.PROCESSING } }),
    ]);

    return {
      total,
      completed,
      failed,
      pending,
      processing,
    };
  }

  async cleanupOldRecords(daysOld = 30): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    const result = await this.createQueryBuilder()
      .delete()
      .where('createdAt < :date', { date })
      .execute();

    return result.affected || 0;
  }
}
