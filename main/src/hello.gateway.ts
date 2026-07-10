// src/gateways/hello.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({
  path: '/ws', // WebSocket 路径，可自定义
  transports: ['websocket'],
})
export class HelloGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log(`Client connected: ${client.url}`);
    // 可以发送欢迎消息
    client.send(JSON.stringify({ event: 'connected', data: 'Welcome!' }));
  }

  handleDisconnect(client: WebSocket) {
    console.log(`Client disconnected: ${client.url}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: WebSocket, data: any): any {
    console.log('Received:', data);
    // 回显 "Hello World"
    return {
      event: 'reply',
      data: `Hello World! You said: ${JSON.stringify(data)}`,
    };
  }
}