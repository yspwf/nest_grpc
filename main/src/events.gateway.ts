import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';


@WebSocketGateway({
    cors: {
        origin: '*', // 允许所有来源
        methods: ['GET', 'POST'], // 允许的 HTTP 方法
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    //跟踪在线用户
    private onlineUsers: Map<string, WebSocket> = new Map();

    private connectedClients = 0;

    handleConnection(client: WebSocket) {
        this.connectedClients++;
        console.log(`Client connected. Total clients: ${this.connectedClients}`);
    }

    handleDisconnect(client: WebSocket) {
        this.connectedClients--;
        console.log(`Client disconnected. Total clients: ${this.connectedClients}`);
    }


    @SubscribeMessage('chatMessage')
    handleChatMessage(client: WebSocket, payload: {message: string, username: string}): void {
        // 处理聊天消息

        
    }

}