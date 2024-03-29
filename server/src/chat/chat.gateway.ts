import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from "./chat.service";
import { MessageInterface } from "./message.interface";
import { forwardRef, Inject, UseGuards } from "@nestjs/common";
import { SocketGuard } from "../auth/socket.guard";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayInit{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}

  @SubscribeMessage('message')
  @UseGuards(SocketGuard)
  handleMessage(client: any, payload: {id: string, dto: MessageInterface}): any {
  }

  @SubscribeMessage('append-to-room')
  @UseGuards(SocketGuard)
  appendToRoom(client: any, payload: {roomID}) {
    client.join(payload.roomID);
  }

  @UseGuards(SocketGuard)
  afterInit(server: Server) {}

  newMessage(toFriend: string, userID: string, chatID: string, message: MessageInterface) {
    this.server.to(toFriend).emit('new-message', { friend: {id: userID}, chat: {id: chatID}, message });
  }

  deleteMessage(chatID: string, messageID: string, userID: string) {
    this.server.to(chatID).except(userID).emit('deleteMessage', messageID);
  }
}
