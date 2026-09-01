// src/gateways/hello.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({
  // port: 3000, // WebSocket 服务器端口
  path: '/ws', // WebSocket 路径，可自定义
  transports: ['websocket'],
})
export class HelloGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  // ----生命周期钩子----
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: WebSocket, ...args: any[]) {
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


  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    console.log('Received Event:', data);
    client.send(JSON.stringify({ event: 'event-reply', data: `Event received: ${JSON.stringify(data)}` }));
  }
}