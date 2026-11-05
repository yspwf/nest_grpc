import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';

const logger = new Logger();

@Injectable()
export class AuthService implements CanActivate {
  // Auth logic here

  canActivate(context: ExecutionContext): boolean {
    // Activation logic here
    const request = context.switchToHttp().getRequest();

    logger.log('AuthService canActivate called', `url: ${request.url}, headers: ${JSON.stringify(request.headers)}, authorization: ${request.headers.authorization}`);

    return true;
  }
}