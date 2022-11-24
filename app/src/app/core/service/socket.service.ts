import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { environment } from "../../../environments/environment";
import { StorageService } from "./storage.service";
import { MessageInterface } from "../interface/message.interface";
import { ChatService } from "./chat.service";
import {from, fromEvent, of} from "rxjs";
import {fromPromise} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  configUrl = environment.configUrl;
  socket: Socket;

  constructor(
    private chatService: ChatService,
    private storageService: StorageService,
  ) { }

  async connect() {
    if(!this.socket?.connected){
      let token = await this.createSocket();
      if(!token) return;
    }

    this.socket.on('new-message', (message: MessageInterface) => {
      this.chatService.newMessageSocket(message);
    })

    this.socket.on('deleteMessage', (id: string) => {
      this.chatService.deleteMessageSocket(id);
    })
  }

  async createSocket() {
    let token = await this.storageService.get('token');
    if( !token ) return false;

    this.socket = io(environment.configUrl,{
      extraHeaders: {Authorization: `Bearer ${ token }`},
    });

    return true;
  }

  appendToRoom(roomID: string) {
    this.socket.emit('append-to-room', {roomID})
  }

  messageReceive(chatID: string, message: MessageInterface) {
    return fromPromise(new Promise((resolve) => {
      this.socket.emit('message', {id: chatID, dto: message}, (message) => resolve(message));
    }))
  }

}
