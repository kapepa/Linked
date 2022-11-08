import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {ChatInterface} from "./chat.interface";
import {ChatService} from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(
    private ChatService: ChatService
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: {id: string, message: any}): string {
    console.log(payload)
    return 'Hello world!';
  }

  afterInit(server: Server) {}

  handleConnection(client: Socket, ...args: any[]){
    console.log('connection')
  }

  handleDisconnect(client: Socket){
    console.log('disconnection')
  }


}
