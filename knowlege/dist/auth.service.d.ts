import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthService implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
