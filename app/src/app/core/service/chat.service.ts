import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Socket } from "socket.io-client";
import { ChatInterface } from "../interface/chat.interface";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { catchError, switchMap, take, tap } from "rxjs/operators";
import { StorageService } from "./storage.service";
import { UserInterface } from "../interface/user.interface";
import { MessageInterface } from "../interface/message.interface";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  configUrl = environment.configUrl;
  socket: Socket;

  friends: UserInterface[];
  friends$: BehaviorSubject<UserInterface[]> = new BehaviorSubject<UserInterface[]>(null);

  chat: ChatInterface;
  chat$: BehaviorSubject<ChatInterface> = new BehaviorSubject<ChatInterface>(null);

  activeConversation: string;
  activeConversation$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  activeFriend: number;
  activeFriend$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  messageLimited: boolean;
  messageLimited$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private storageService: StorageService,
  ) {}

  newMessageSocket(message: MessageInterface) {
    this.chat.chat.push(message);
    this.chat$.next(this.chat);
  }

  deleteMessageSocket(id: string) {
    let chat = this.chat.chat.filter(message => message.id !== id);

    if(chat.length !== this.chat.chat.length) {
      this.chat.chat = chat;
      this.chat$.next(this.chat);
    }
  }

  messageReceive(message: MessageInterface) {
    let friend = Object.assign(this.friends[this.activeFriend], {});

    this.chat.chat.push(message);
    this.chat$.next(this.chat);
    this.friends.splice(this.activeFriend, 1);
    this.friends.unshift(friend);
    this.friends$.next(this.friends);
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

  requestChat(id: string, params?: { take?: number, skip?: number }): Observable<ChatInterface> {
    return this.http.get<ChatInterface>(
      `${this.configUrl}/api/chat/one/${id}`,
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

  receiveAllConversation(query?: {skip: number, take: number}): Observable<{friends: UserInterface[], chat: ChatInterface}> {
    let params = query && !!Object.keys(query).length ? query : undefined;
    return this.http.get<{friends: UserInterface[], messages: MessageInterface[], chat: ChatInterface}>(`${this.configUrl}/api/chat/conversation`, {params}).pipe(
      tap(( dto: { friends: UserInterface[], chat: ChatInterface } ) => {
        this.friends = dto.friends;
        this.friends$.next(this.friends);
        this.chat = dto.chat;
        this.chat$.next(this.chat);
        this.activeConversation = this.friends[0].id;
        this.activeConversation$.next(this.activeConversation);
        this.activeFriend = 0;
        this.activeFriend$.next(this.activeFriend);
      }),
      catchError(this.httpService.handleError),
    )
  }

  loadMessage(): Observable<{ messages: MessageInterface[]; limited: boolean }> {
    return this.http.get<{ messages: MessageInterface[]; limited: boolean }>(
      `${this.configUrl}/api/chat/messages`, {params: {id: this.chat.id, take: 20, skip: this.chat.chat.length}}).pipe(
      take(1),
      tap((dto: { messages: MessageInterface[]; limited: boolean }) => {
        this.chat.chat.unshift(...dto.messages);
        this.chat$.next(this.chat);
        this.messageLimited = dto.limited;
        this.messageLimited$.next(this.messageLimited);
      }),
      catchError(this.httpService.handleError),
    )
  }

  changeActiveConversation(id: string, index: number): Observable<any> {
    this.chat.chat = [];
    this.chat$.next(this.chat);

    return this.http.get<any>(`${this.configUrl}/api/chat/change/${id}`).pipe(
      take(1),
      tap((chat: ChatInterface) => {
        this.activeFriend = index;
        this.activeFriend$.next(this.activeFriend);
        this.activeConversation = id;
        this.activeConversation$.next(this.activeConversation);
        this.chat = chat;
        this.chat$.next(this.chat);
      })
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

  get getFriends(): Observable<UserInterface[]> {
    return this.friends$.asObservable();
  }

  get getMessages(): Observable<MessageInterface[]> {
    return this.chat$.asObservable().pipe(
      switchMap(( chat: ChatInterface) => {
        return of(chat.chat);
      })
    );
  }

  get getActiveConversation(): Observable<string> {
    return this.activeConversation$.asObservable();
  }

  get getMessageLimited(): Observable<boolean> {
    return this.messageLimited$.asObservable();
  }
}
