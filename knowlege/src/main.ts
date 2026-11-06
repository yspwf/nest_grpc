import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express';
// import { ResponseFormatMiddleware } from './response-format.middleware';
// import { TransformInterceptor } from './transform.interceptor';

import compression from 'compression';


// export const responseFormatFn = (req: Request, res: Response, next: NextFunction) => {
//   const originalSend = res.send.bind(res);
//   res.send = function (body: any) {
//     return originalSend({
//       code: res.statusCode,
//       data: body,
//       timestamp: new Date().toISOString(),
//     });
//   } as typeof res.send;
//   next();
// };

export const responseFormatFn = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send.bind(res);

  res.send = function (body: any) {
    // 守卫：本次响应只包装一次
    // Express json() 内部会再调 this.send，第二次进来时直接透传
    if (!res.locals.__formatted) {
      res.locals.__formatted = true;
      body = {
        code: res.statusCode,
        data: body,
        timestamp: new Date().toISOString(),
      };
    }
    return originalSend(body);
  } as typeof res.send;

  next();
};


const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(responseFormatFn);

  app.use(compression()); // 启用 gzip 压缩

  // app.useGlobalInterceptors(new TransformInterceptor());

  // app.useGlobalFilters(new (require('./custom-exception.filter').CustomExceptionFilter)());

  // app.useLogger(logger);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
