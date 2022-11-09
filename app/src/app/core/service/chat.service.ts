import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { io, Socket } from "socket.io-client";
import { ChatInterface, MessageInterface } from "../interface/chat.interface";
import {BehaviorSubject, from, Observable, pipe} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { catchError, take, tap } from "rxjs/operators";

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
  ) {}

  connect() {
    this.socket = io(environment.configUrl);
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

  get getChat(): Observable<ChatInterface> {
    return this.chat$.asObservable();
  }
}
