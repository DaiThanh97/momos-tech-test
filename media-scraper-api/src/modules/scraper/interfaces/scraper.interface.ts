export interface ScrapedResult {
  sourceUrl: string;
  pageTitle?: string;
  pageDescription?: string;
  mediaUrls: {
    images: string[];
    videos: string[];
  };
  imageCount: number;
  videoCount: number;
  processingTimeMs: number;
}

export interface ScrapeJobData {
  url: string;
  requestIp?: string;
  userAgent?: string;
  jobId?: string;
}

export interface ScrapeJobResult {
  id: string;
  status: string;
  data?: ScrapedResult;
  error?: string;
}

export interface ScrapeResult {
  images: string[];
  videos: string[];
  title?: string;
  description?: string;
}
