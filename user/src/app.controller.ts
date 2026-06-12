import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService) {}

  @Get()
  getHello(): string {
    const type = this.configService.get<string>('DATABASE_TYPE');
    const host = this.configService.get<string>('DATABASE_HOST');
    console.log(type, host);
    return this.appService.getHello();
  }

}
