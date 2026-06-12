import type { FastifyPluginAsync } from 'fastify';
import fetch from 'node-fetch';

export const bffPlugin: FastifyPluginAsync = async (app) => {
  app.get('/bff/dashboard', async (req, reply) => {
    const [user, orders] = await Promise.all([
      fetch('http://localhost:4002/me').then(res => res.json()),
      fetch('http://localhost:4003/list').then(res => res.json()),
    ]);
    return { user, orders };
  });
};