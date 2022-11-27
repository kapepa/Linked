import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { environment } from "../../../environments/environment";
import { StorageService } from "./storage.service";
import { MessageInterface } from "../interface/message.interface";
import { ChatService } from "./chat.service";
import { fromPromise } from "rxjs/internal-compatibility";
import { PersonService } from "./person.service";
import { UserService } from "./user.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  configUrl = environment.configUrl;
  socket: Socket;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private userService: UserService,
    private personService: PersonService,
    private storageService: StorageService,
  ) { }

  async connect() {
    if(!this.socket?.connected){
      let token = await this.createSocket();
      if(!token) return;
    }

    if(this.socket?.connected){
      await this.reconnectSocket();
    }

    this.socket.on('new-message', (message: MessageInterface) => {
      this.chatService.newMessageSocket(message);
    })

    this.socket.on('deleteMessage', (id: string) => {
      this.chatService.deleteMessageSocket(id);
    })

    this.socket.on('notificationAddFriend', (dto: { id: string }) => {
      this.userService.getOwnProfile().subscribe(() => {this.getPerson(dto)});
    })

    this.socket.on('changeFriendSuggest', (dto: { id: string }) => {
      this.getPerson(dto);
    })

    this.socket.on('deleteFriendSuggest', (dto: { id: string }) => {
      this.getPerson(dto);
    })

    this.socket.on('declineFried', (dto: { id: string }) => {
      this.getPerson(dto);
    })
  }

  getPerson(dto: { id: string }) {
    if(this.router.url === `/person/${dto.id}`){
      this.personService.getPerson(dto.id).subscribe(() => {})
    }
  }

  async createSocket() {
    let token = await this.storageService.get('token');
    if( !token ) return false;

    this.socket = io(environment.configUrl,{
      extraHeaders: {Authorization: `Bearer ${ token }`},
    });

    return true;
  }

  async reconnectSocket() {
    let token = await this.storageService.get('token');
    if( !token ) return false;

    this.socket.io.opts.extraHeaders = {Authorization: `Bearer ${token}`};
    this.socket.disconnect().connect();
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
