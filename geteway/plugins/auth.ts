import type { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';

export type AuthUser = {
  id: number;
  roles: string[];
  tenantId: string;
};


const JWT_SECRET = 'access_secret';

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return reply.code(401).send({ error: 'no token' });

    try {
    //   req.user = jwt.verify(token, JWT_SECRET) as { id: number; roles: string[] };
      req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    } catch {
      return reply.code(401).send({ error: 'invalid token' });
    }
  });
};
