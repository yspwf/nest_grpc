import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseService implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = {
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: 'Request successful',
                    data: data,
                };
                return response;
            })
        );
    }   
}