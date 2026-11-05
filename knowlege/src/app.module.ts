import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ResponseService } from './response.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TaskModule],
  controllers: [AppController],
  providers: [AppService, 
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   useClass: ResponseService,
    // }
  ],
})
export class AppModule {}
