import 'fastify';
import { FastifyHttpErrors } from '@fastify/http-errors';


declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: number; roles: string[] };
    tenantId?: string;
    upstream?: string;
  }
  interface FastifyInstance {
    httpErrors: FastifyHttpErrors;
  }
}