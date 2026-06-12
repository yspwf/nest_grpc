import type { FastifyPluginAsync } from 'fastify';

export const tenantPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req) => {
    const tenant = req.headers['x-tenant-id'] as string;
    if (!tenant) throw app.httpErrors.badRequest('missing tenant');

    req.tenantId = tenant;

    // 简单动态路由示例
    req.upstream =
      tenant === 'a' ? 'http://localhost:4000' : 'http://localhost:4001';
  });
};