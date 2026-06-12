import type { FastifyPluginAsync } from 'fastify';
// import prom from 'prom-client';

// export const metricsPlugin: FastifyPluginAsync = async (app) => {
//   const collectDefaultMetrics = prom.collectDefaultMetrics;
//   collectDefaultMetrics();

//   app.get('/metrics', async () => {
//     return prom.register.metrics();
//   });
// };