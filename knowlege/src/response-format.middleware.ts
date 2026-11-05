import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseFormatMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    
    res.send = function (body: any) {
      // 统一包装响应体
      const formattedBody = {
        code: res.statusCode,
        data: body,
        timestamp: new Date().toISOString(),
      };
      originalSend.call(formattedBody);
    } as typeof res.send;
 
    next();
  }
}
