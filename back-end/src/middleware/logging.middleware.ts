import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      const { statusCode } = res;

      const baseMessage = `${method} ${originalUrl} ${statusCode} - ${elapsed}ms`;

      this.logger.log(baseMessage);

      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(baseMessage);
      } else if (statusCode >= 500) {
        this.logger.error(baseMessage);
      }

      if (process.env.DEBUG === 'true') {
        this.logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
        this.logger.verbose(`IP: ${req.ip}`);
      }
    });

    next();
  }
}