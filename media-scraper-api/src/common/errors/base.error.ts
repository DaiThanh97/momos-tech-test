export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, BaseError);
  }
}

export class CreateUserError extends BaseError {}
export class InvalidCredentialsError extends BaseError {}
export class UsernameExistedError extends BaseError {}
export class YoutubeError extends BaseError {}
export class ShareVideoError extends BaseError {}

export class ScraperError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export class InvalidUrlError extends ScraperError {
  constructor(url: string) {
    super(`Invalid URL provided: ${url}`);
    this.name = 'InvalidUrlError';
  }
}

export class FetchError extends ScraperError {
  constructor(url: string, reason: string) {
    super(`Failed to fetch URL ${url}: ${reason}`);
    this.name = 'FetchError';
  }
}

export class ParseError extends ScraperError {
  constructor(url: string, reason: string) {
    super(`Failed to parse content from ${url}: ${reason}`);
    this.name = 'ParseError';
  }
}

export class QueueError extends ScraperError {
  constructor(reason: string) {
    super(`Queue operation failed: ${reason}`);
    this.name = 'QueueError';
  }
}
