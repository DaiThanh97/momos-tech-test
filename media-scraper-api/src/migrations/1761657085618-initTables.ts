import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1761657085618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS scraped_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sourceUrl VARCHAR(2048) NOT NULL,
        pageTitle TEXT,
        pageDescription TEXT,
        mediaUrls JSON,
        imageCount INT DEFAULT 0,
        videoCount INT DEFAULT 0,
        status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
        errorMessage TEXT,
        processingTimeMs INT,
        requestIp VARCHAR(45),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS scraped_media`);
  }
}
