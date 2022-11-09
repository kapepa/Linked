import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";
import { MessageInterface } from "./message.interface";
import { Observable, of, switchMap, take, tap } from "rxjs";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService
  ) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: {id: string, message: MessageInterface}): any {
    return this.chatService.addNewMessage(payload.message).pipe(
      take(1),
      tap((message: MessageInterface) => client.broadcast.to(payload.id).emit('new-message', message)),
    );
  }

  @SubscribeMessage('delete')
  deleteMessage(client: any, mock: {chatID: string, message: MessageInterface}): any  {
    return this.chatService.deleteMessage(mock.message.id).pipe(
      take(1),
      tap(() => {
        client.broadcast.to(mock.chatID).emit('deleteMessage', mock.message.id)
      })
    );
  }

  @SubscribeMessage('append-to-room')
  appendToRoom(client: any, payload: {roomID}) {
    client.join(payload.roomID);
  }

  afterInit(server: Server) {}

  handleConnection(client: Socket, ...args: any[]){
    console.log('connection')
  }

  handleDisconnect(client: Socket){
    console.log('disconnection')
  }


}
