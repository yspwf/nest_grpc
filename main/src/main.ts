import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WsAdapter } from './ws.adapter';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
  
  console.log('Server running on http://localhost:3000');
  console.log('WebSocket endpoint: ws://localhost:3000/ws');
}
bootstrap();
