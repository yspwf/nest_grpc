import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloGateway } from './hello.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HelloGateway],
})
export class AppModule {}
