import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
// import redisPlugin from '@fastify/redis';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';


const server: FastifyInstance = Fastify({ logger: true });

 
// 创建带默认类型的Fastify实例
// const server = fastify({
//   logger: true
// })

// ---------------------------
// 1️⃣ Redis
// ---------------------------
// await server.register(redisPlugin, {
//   url: 'redis://localhost:6379',
// });

// ---------------------------
// 2️⃣ 安全 HTTP 头
// ---------------------------
await server.register(helmet);

// ---------------------------
// 3️⃣ CORS
// ---------------------------
await server.register(cors, {
  origin: '*',
});

// ---------------------------
// 4️⃣ Swagger 文档
// ---------------------------
// await server.register(swagger as any, {
//   swagger: {
//     info: {
//       title: 'API Gateway',
//       description: 'Fastify + TypeScript + Swagger',
//       version: '1.0.0',
//     },
//     consumes: ['application/json'],
//     produces: ['application/json'],
//   },
//   exposeRoute: true, // 注意：TS 类型不兼容，使用 "as any" 或升级 swagger 类型
// });

await server.register(swagger as any, { // ⚠️ TS 断言，避免类型报错
  swagger: {
    info: {
      title: 'My API Gateway',
      description: 'Fastify + TypeScript + Swagger',
      version: '1.0.0',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

// ---------------------------
// 2️⃣ 注册 Swagger UI
// ---------------------------
await server.register(swaggerUI as any, {
  routePrefix: '/docs', // 文档 UI 地址
  swagger: {
    info: { title: 'My API Gateway', version: '1.0.0' },
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP:  (header: string) => header, // ✅ 显式类型
});


// ---------------------------
// 5️⃣ JWT
// ---------------------------
await server.register(jwt, { secret: 'supersecret' });

// ---------------------------
// 6️⃣ 限流
// ---------------------------
await server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// ---------------------------
// 7️⃣ JWT 保护路由
// ---------------------------
server.decorate(
  'authenticate',
  async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  }
);

/* -------------------------
 * JWT Auth Hook
 * ------------------------- */
async function auth(req: any, reply: any) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}

/* -------------------------
 * Redis Cache Helper
 * ------------------------- */
// async function cacheGetSet<T>(
//   key: string,
//   fetcher: () => Promise<T>,
//   ttl = 30
// ): Promise<T> {
//   const cached = await server.redis.get(key);
//   if (cached) return JSON.parse(cached);

//   const data = await fetcher();
//   await server.redis.set(key, JSON.stringify(data), 'EX', ttl);
//   return data;
// }

/* -------------------------
 * Proxy 工具（类型安全）
 * ------------------------- */
async function proxy(
  upstream: string,
  req: any
): Promise<Response> {
    const body: string | null = req.method === 'GET' ? null : JSON.stringify(req.body ?? null);
    return fetch(upstream + req.url, {
        method: req.method,
        headers: req.headers as any,
        body
    });
}

/* -------------------------
 * BFF 聚合接口
 * ------------------------- */
// server.get(
//   '/bff/dashboard',
//   { preHandler: auth, schema: { tags: ['BFF'] } },
//   async (req) => {
//     const userId = req.user!.userId;

//     return cacheGetSet(`dashboard:${userId}`, async () => {
//       const [userRes, orderRes] = await Promise.all([
//         fetch(`http://localhost:4001/users/${userId}`).then(r => r.json()),
//         fetch(`http://localhost:4002/orders?userId=${userId}`).then(r => r.json()),
//       ]);

//       return {
//         user: userRes,
//         orders: orderRes,
//       };
//     });
//   }
// );

/* -------------------------
 * Proxy 路由（动态转发）
 * ------------------------- */
server.all(
  '/products/*',
  { preHandler: auth },
  async (req, reply) => {
    const res = await proxy('http://localhost:4003', req);
    reply.code(res.status);
    return res.json();
  }
);

/* -------------------------
 * Test Login
 * ------------------------- */
server.post(
  '/login',
  {
    schema: {
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
    },
  },
  async (req) => {
    const body = req.body as { userId: string };

    return {
      token: server.jwt.sign({
        userId: body.userId,
        roles: ['user'],
      }),
    };
  }
);


server.get('/ping', {
  schema: {
    description: '测试接口',
    tags: ['测试'],
    response: {
      200: {
        type: 'object',
        properties: {
          pong: { type: 'string' },
        },
      },
    },
  },
}, async () => {
  return { pong: 'pong' };
});


server.get("/", async function handler(request, reply) {
  return { hello: "world" };
});


interface User{
    id: number;
    name: string;
    email: string;
}

const users: User[] = [
    {
        id:1,
        name:"yy",
        email:"yytest@qq.com"
    }
];

server.get<{
    Querystring: {id: number}
}>('/users', async (req, res) =>{
    console.log("req======", req.query)
    return  req.query?.id ? users[req.query?.id] ? users[req.query?.id] : null : users;
})

// 定义带类型的路由
server.get<{
  Querystring: { name?: string }
  Reply: { 200: { message: string } }
}>('/greet', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const name = request.query.name || 'Guest'
  
  // 类型安全的响应
  reply.code(200).send({
    message: `Hello, ${name}!`
  })
})
 
// 启动服务器
const start = async () => {
  try {
    await server.listen({ port: 3000 })
    console.log('Server running on http://localhost:3000')
    console.log('Swagger UI: http://localhost:3000/docs');
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
 
start()

// import fastify from "fastify";

// const server = fastify({
//     logger: true
// })


// server.get<{
//     Querystring: {name?: string},
//     Reply: {200, {message: string}}
// }>('/greet', {

// })




