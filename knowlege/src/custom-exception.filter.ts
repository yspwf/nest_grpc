import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if(!(exception instanceof HttpException)) {
        this.logger.error('Unhandled exception occurred', exception instanceof Error ? exception.stack : String(exception), {
            path: request.url
        });
    }

    // this.logger.error(exception.message, exception.stack, {
    //     path: request.url
    // });
    console.log('Exception caught by CustomExceptionFilter:', JSON.stringify(exception));
    response.status(status).json({
      code: status,
      message: exception instanceof HttpException ? exception.message : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

}