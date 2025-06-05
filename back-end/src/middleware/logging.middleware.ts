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

      const baseMessage = `${method} ${originalUrl} ${statusCode} +${elapsed}ms`;

      if (statusCode >= 200 && statusCode < 300) {
        this.logger.log(baseMessage);
      } else if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(baseMessage);
      } else if (statusCode >= 500) {
        this.logger.error(baseMessage);
      }

      if (process.env.DEBUG === 'true') {
        const ipLog = `IP: ${req.ip}`;
        const headersLog = `Headers:\n${JSON.stringify(req.headers, this.filterSensitiveHeaders, 2)}`;
        const hasBody = req.body && Object.keys(req.body).length > 0;
        const bodyLog = hasBody ? `Body:\n${JSON.stringify(req.body, null, 2)}` : '';
        const debugMessage = [ipLog, headersLog, bodyLog].filter(Boolean).join('\n');
        this.logger.debug(debugMessage);
      }

    });

    next();
  }

  private filterSensitiveHeaders(key: string, value: any): any {
    const sensitiveHeaders = ['authorization', 'cookie'];
    return sensitiveHeaders.includes(key.toLowerCase()) ? '***' : value;
  }
}
