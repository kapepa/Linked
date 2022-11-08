import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { io, Socket } from "socket.io-client";
import {ChatInterface, MessageInterface} from "../interface/chat.interface";
import {BehaviorSubject, Observable, pipe} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";
import {catchError, take, tap} from "rxjs/operators";
import * as buffer from "buffer";

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
  }

  message(chatID: string, message: MessageInterface) {
    this.socket.emit('message', {id: chatID, message});
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
