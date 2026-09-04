import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type AuthUser = {
  id: string;
  role: string;
  [key: string]: unknown;
};

type RequestWithUser = Request & {
  user?: AuthUser;
};

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const decoded = JSON.parse(
        Buffer.from(token, 'base64').toString('utf-8'),
      ) as AuthUser;
      (req as RequestWithUser).user = decoded;
      next();
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
}
