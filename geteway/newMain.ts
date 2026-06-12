// import Fastify from 'fastify';
// import replyFrom from '@fastify/reply-from';
// import helmet from '@fastify/helmet';
// import rateLimit from '@fastify/rate-limit';
// import cors from '@fastify/cors';

// import { authPlugin } from './plugins/auth.js';
// import { tenantPlugin } from './plugins/tenant.js';
// import { proxyPlugin } from './plugins/proxy.js';
// import { bffPlugin } from './plugins/bff.js';


// const app = Fastify({ logger: true });

// // 基础安全 & 性能
// await app.register(helmet);
// await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
// await app.register(cors);
// await app.register(replyFrom);

// // 插件化 pipeline
// await app.register(authPlugin);
// await app.register(tenantPlugin);
// await app.register(proxyPlugin);
// await app.register(bffPlugin);


// // 启动
// // await app.listen({ port: 3000 });
// // console.log('🚀 Gateway running at http://localhost:3000');

// try {
//     await app.listen({ port: 3000 })
//     console.log('Server running on http://localhost:3000')
//     console.log('Swagger UI: http://localhost:3000/docs');
// } catch (err) {
//     app.log.error(err)
//     process.exit(1)
// }

import Fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

import { authPlugin } from './plugins/auth.js';
import { tenantPlugin } from './plugins/tenant.js';
import { proxyPlugin } from './plugins/proxy.js';
import { bffPlugin } from './plugins/bff.js';
// import { metricsPlugin } from './plugins/metrics';
import { rateLimitPlugin } from './plugins/rateLimit.js';

const app = Fastify({ logger: true });

// 安全 & 性能
await app.register(helmet);
await app.register(cors);
await app.register(sensible);
await app.register(replyFrom);

// 插件化管线
await app.register(rateLimitPlugin);
// await app.register(metricsPlugin);
await app.register(authPlugin);
await app.register(tenantPlugin);
await app.register(proxyPlugin);
await app.register(bffPlugin);

// 启动
await app.listen({ port: 3000 });
console.log('🚀 Kong级 Node Gateway running at http://localhost:3000');