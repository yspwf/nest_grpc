import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WsAdapter } from './ws.adapter';
import { WsAdapter } from '@nestjs/platform-ws';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

type MockUser = {
  id: string;
  role: string;
  [key: string]: unknown;
};

type RequestWithUser = {
  user?: MockUser;
};

// import type {
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify' with {
//   'resolution-mode': 'import',
// };

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  // const {
  //   FastifyAdapter
  // } = await import('@nestjs/platform-fastify');

 const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  // 模拟用户（实际应从JWT或session获取）
  const fastify = app.getHttpAdapter().getInstance();
  fastify.decorateRequest('user', null);
  fastify.addHook('preHandler', async (request) => {
    (request as typeof request & RequestWithUser).user = {
      id: 'user-123',
      role: 'user',
    };
  });

  
  // app.use((req: Request, res: Response, next: () => void) => {
  //   // 演示：为测试注入不同角色
  //   // 可修改这里切换角色：'admin' | 'user' | 'guest'
  //   req.user = {
  //     id: 'user-123',
  //     role: 'user', // 修改此处测试不同角色
  //   };
  //   next();
  // });


  await app.listen(process.env.PORT ?? 3000);
  
  console.log('Server running on http://localhost:3000');
  console.log('WebSocket endpoint: ws://localhost:3000/ws');
}
bootstrap();
