import { Injectable } from '@nestjs/common';
import { User } from './response.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }


  getTest(): User[] {
     const users: User[] = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];
    return users;
  }
}
