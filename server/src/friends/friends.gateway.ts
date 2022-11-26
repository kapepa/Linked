import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards } from "@nestjs/common";
import { SocketGuard } from "../auth/socket.guard";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class FriendsGateway{
  @WebSocketServer()
  server: Server;

  constructor(

  ) {}

  @SubscribeMessage('add')
  @UseGuards(SocketGuard)
  addFriend(client: any, payload: any): any {

  }

  notificationAddFriend(friendID: string, userID: string){
    this.server.to(friendID).emit('notificationAddFriend',{id: userID});
  }

  changeFriendSuggest(personID: string, userID: string){
    this.server.to(personID).emit('changeFriendSuggest', {id: userID});
  }

  deleteFriendSuggest(personID: string, userID: string){
    this.server.to(personID).emit('deleteFriendSuggest', {id: userID});
  }

}
