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

import { authPlugin } from './plugins/auth.ts';
import { tenantPlugin } from './plugins/tenant.ts';
import { proxyPlugin } from './plugins/proxy.ts';
import { bffPlugin } from './plugins/bff.ts';
// import { metricsPlugin } from './plugins/metrics';
import { rateLimitPlugin } from './plugins/rateLimit.ts';

const app = Fastify({ logger: true });

// 安全 & 性能
await app.register(helmet);
await app.register(cors);
await app.register(sensible);
// await app.register(replyFrom);
app.register(replyFrom, {
//   核心：Undici 连接池配置
  undici: {
    connections: 128,        // 单上游最大并发连接数，默认 64
    pipelining: 10,         // 单连接流水线请求数，HTTP/1.1 下大幅提升吞吐量
    keepAliveTimeout: 30000,// 长连接保活时间
    connectTimeout: 5000,   // 连接超时
  },
  cacheURLs: 200,           // 提升 URL 缓存数量，减少解析开销
})

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
