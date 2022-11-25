import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from "./chat.service";
import { MessageInterface } from "./message.interface";
import { take, tap } from "rxjs";
import { UseGuards } from "@nestjs/common";
import { SocketGuard } from "../auth/socket.guard";
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit{
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('message')
  @UseGuards(SocketGuard)
  handleMessage(client: any, payload: {id: string, dto: MessageInterface}): any {
    return this.chatService.addNewMessage(payload).pipe(
      take(1),
      tap((message: MessageInterface) => {
        client.broadcast.to(payload.id).emit('new-message', message)
      }),
    );
  }

  @SubscribeMessage('delete')
  @UseGuards(SocketGuard)
  deleteMessage(client: any, mock: {chatID: string, message: MessageInterface}): any  {
    return this.chatService.deleteMessage(mock.message.id).pipe(
      take(1),
      tap(() => {
        client.broadcast.to(mock.chatID).emit('deleteMessage', mock.message.id)
      })
    );
  }

  @SubscribeMessage('append-to-room')
  @UseGuards(SocketGuard)
  appendToRoom(client: any, payload: {roomID}) {
    client.join(payload.roomID);
  }

  @UseGuards(SocketGuard)
  afterInit(server: Server) {}
}
