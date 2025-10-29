import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `[${req.method}] ${req.path} | PARAMS: ${JSON.stringify(
        req.params,
      )} | QUERIES: ${JSON.stringify(req.query)} | BODY: ${JSON.stringify(
        req.body,
      )} | HEADERS: ${JSON.stringify(req.headers)}`,
    );
    next();
  }
}
