import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloGateway } from './hello.gateway';
import { PermissionsModule } from './permissions/permissions.module';
import { PostsModule } from './posts/posts.module';

import { LoggerMiddleware } from './middlewares/loggerMiddleware';
import { Request, Response, NextFunction } from 'express';

@Module({
  imports: [PermissionsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService, HelloGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    
    consumer.apply((req: Request, res: Response, next: NextFunction) => {
        console.log('hello world');
        debugger;
        next();
      }).forRoutes('*');
  }
}
