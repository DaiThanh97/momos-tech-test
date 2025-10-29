// User Types
export interface User {
  id?: number;
  username: string;
  name: string;
  accessToken?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  password: string;
  name: string;
  rePassword: string;
}

export interface AuthResponse {
  accessToken: string;
  username: string;
  name: string;
}

// Scraper/Media Types
export interface MediaUrls {
  images: string[];
  videos: string[];
}

export interface ScrapeJob {
  id: string;
  sourceUrl: string;
  status: ScrapingStatus;
  pageTitle?: string;
  pageDescription?: string;
  mediaUrls?: MediaUrls;
  imageCount?: number;
  videoCount?: number;
  processingTimeMs?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScrapeUrlsParams {
  urls: string[];
}

export interface MediaItem {
  url: string;
  type: MediaType;
  sourceUrl: string;
  pageTitle?: string;
  jobId: string;
  scrapedAt: Date;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ListMediaResponse {
  data: MediaItem[];
  meta: PaginationMeta;
}

export interface ListMediaParams {
  page?: number;
  limit?: number;
  type?: MediaTypeFilter;
  search?: string;
}

// Redux State Types
export interface UserState {
  username: string;
  name: string;
  isLoggedIn: boolean;
}

export interface MediaState {
  mediaList: MediaItem[];
  pagination: PaginationMeta | null;
  currentFilter: MediaTypeFilter;
  searchText: string;
}

export interface LoadingState {
  loadingLogin: boolean;
  loadingSignUp: boolean;
  loadingScrape: boolean;
  loadingMedia: boolean;
}

export interface NotiState {
  noti: {
    status: number;
    message: string;
  };
}

export interface RootState {
  user: UserState;
  media: MediaState;
  loading: LoadingState;
  noti: NotiState;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  isProtected?: boolean;
}

// Constants
export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum StorageKey {
  USER_TOKEN = "USER_TOKEN",
  NAME = "NAME",
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export enum ScrapingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum MediaTypeFilter {
  IMAGE = "image",
  VIDEO = "video",
  ALL = "all",
}
