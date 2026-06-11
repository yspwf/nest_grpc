import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

 

  getDbInfo() {
    const type = this.configService.get<string>('DATABASE_TYPE');
    const host = this.configService.get<string>('DATABASE_HOST');
    return { type, host };
  }
}
