import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SocketGuard } from "./auth/socket.guard";
import { UsersDto } from "./users/users.dto";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
  ) {}

  @UseGuards(SocketGuard)
  handleConnection(client: Socket, ...args: any[]){
    this.runToken(client, 'connection');
  }

  @UseGuards(SocketGuard)
  handleDisconnect(client: Socket){
    this.runToken(client, 'disconnect');
  }

  runToken(client: Socket, action: 'connection' | 'disconnect') {
    let bearer = client.handshake.headers.authorization.split(' ').pop();
    if( !!bearer?.length ) {
      let decode = this.jwtService.decode(bearer) as UsersDto;
      if( action === 'connection') client.join(decode.id);
      if( action === 'disconnect') client.leave(decode.id);
    }
  }
}