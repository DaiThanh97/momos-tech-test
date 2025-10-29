import axios, { AxiosResponse } from "axios";
import type {
  ListMediaResponse,
  ListMediaParams,
  ScrapeJob,
  ScrapeUrlsParams,
} from "../types";

class ScraperService {
  private readonly apiUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3000";

  async scrapeUrls(
    params: ScrapeUrlsParams
  ): Promise<AxiosResponse<ScrapeJob[]>> {
    return axios.post(`${this.apiUrl}/scraper/scrape`, params);
  }

  async getMedia(
    params: ListMediaParams
  ): Promise<AxiosResponse<ListMediaResponse>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.type) queryParams.append("type", params.type);
    if (params.search) queryParams.append("search", params.search);

    return axios.get(`${this.apiUrl}/scraper/media?${queryParams.toString()}`);
  }
}

export const scraperService = new ScraperService();
