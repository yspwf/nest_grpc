import { AppService } from './app.service';
import { User } from './response.dto';
export declare class CreateDto {
    name: string;
    age: number;
    email?: string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    exception(): string;
    test(): User[];
    create(createDto: CreateDto): string;
}
