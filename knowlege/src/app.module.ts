import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ResponseService } from './response.service';
import { TaskModule } from './task/task.module';
import { TransformInterceptor } from './transform.interceptor';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { CustomExceptionFilter } from './custom-exception.filter';


@Module({
  imports: [TaskModule],
  controllers: [AppController],
  providers: [AppService, 
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   useClass: ResponseService,
    // }
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    }
  ],
})
export class AppModule {}
