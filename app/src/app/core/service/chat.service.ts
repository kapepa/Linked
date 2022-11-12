import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { io, Socket } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../interface/chat.interface";
import { BehaviorSubject, from, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { catchError, take, tap } from "rxjs/operators";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  configUrl = environment.configUrl;
  socket: Socket;
  chat: ChatInterface;
  chat$: BehaviorSubject<ChatInterface> = new BehaviorSubject<ChatInterface>(null);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private storageService: StorageService
  ) {}

  async connect() {

    if(!this.socket?.connected){
      let token = await this.createSocket();
      if(!token) return;
    }

    this.socket.on('new-message', (message: MessageInterface) => {
      this.chat.chat.push(message);
      this.chat$.next(this.chat);
    })
    this.socket.on('deleteMessage', (id: string) => {
      let chat = this.chat.chat.filter(message => message.id !== id);

      if(chat.length !== this.chat.chat.length) {
        this.chat.chat = chat;
        this.chat$.next(this.chat);
      }
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

  message(chatID: string, message: MessageInterface) {
    return from([
      this.socket.emit('message', {id: chatID, message}, (message) => {
        this.chat.chat.push(message);
        this.chat$.next(this.chat);
      })
    ]).pipe(
      take(1),
    );
  }

  deleteMessage(index: number, message: MessageInterface): Observable<any> {
    return from([
      this.socket.emit('delete', { chatID: this.chat.id , message }, () => {
        this.chat.chat.splice(index, 1);
        this.chat$.next(this.chat);
      }),
    ]).pipe(
      take(1),
    );
  }

  appendToRoom(roomID: string) {
    this.socket.emit('append-to-room', {roomID})
  }

  requestChat(id: string, params?: { take?: number, skip?: number }): Observable<ChatInterface> {
    return this.http.get<ChatInterface>(
      `${this.configUrl}/api/chat/${id}`,
      {params: params}
    ).pipe(
      take(1),
      tap((chat: ChatInterface) => {
        this.chat = chat;
        this.chat$.next(this.chat);
      }),
      catchError(this.httpService.handleError),
    )
  }

  async updateToken() {
    let token = await this.storageService.get('token');
    this.socket.io.opts.extraHeaders = {Authorization: `Bearer ${token}`};
    this.socket.disconnect().connect();
  }

  get getChat(): Observable<ChatInterface> {
    return this.chat$.asObservable();
  }
}
