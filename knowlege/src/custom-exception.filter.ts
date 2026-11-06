import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { zodErrorToChinese } from './zod-cn';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[];
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as unknown as import('zod').ZodError; // 强制类型转换为 ZodError
      // console.log('Zod validation error:', zodError.issues.at(0)?.message);
      // 接你之前写的中文映射函数
      // message = zodErrorToChinese(zodError);
      message = zodError.issues.map((issue) => issue.message); // 直接使用 Zod 的原始错误信息
    } else if (exception instanceof HttpException) {
      message = exception.message;
    } else {
      message = 'Internal server error';
    }


    if(!(exception instanceof HttpException)) {
        this.logger.error('Unhandled exception occurred', exception instanceof Error ? exception.stack : String(exception), {
            path: request.url
        });
    }

    // this.logger.error(exception.message, exception.stack, {
    //     path: request.url
    // });
    // console.log('Exception caught by CustomExceptionFilter:', JSON.stringify(exception));
    response.status(status).json({
      code: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

}