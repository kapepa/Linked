import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Socket } from "socket.io-client";
import { ChatInterface } from "../interface/chat.interface";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http.service";
import { catchError, switchMap, take, tap } from "rxjs/operators";
import { UserInterface } from "../interface/user.interface";
import { MessageInterface } from "../interface/message.interface";

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  configUrl = environment.configUrl;
  socket: Socket;

  first: string | null;
  first$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

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

  noReadMessage: boolean;
  noReadMessage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  noReadFriend: string[] = [];
  noReadFriend$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
  ) {}

  newMessageSocket(dto: { friend: {id: string}, chat: {id: string}, message: MessageInterface}) {
    let { friend, chat, message } = dto;
    if (this.chat.id === chat.id) {
      this.chat.chat.push(message);
      this.chat$.next(this.chat);
    } else {
      this.noReadMessage = true;
      this.noReadMessage$.next(this.noReadMessage);
      this.noReadFriend.push(friend.id);
      this.noReadFriend$.next(this.noReadFriend);
    }
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

  deleteMessage(index: number, message: MessageInterface) {
    this.chat.chat.splice(index, 1);
    this.chat$.next(this.chat);
    return from([{ chatID: this.chat.id , message }]);
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

  receiveAllConversation(query?: {skip: number, take: number, first: string}):
    Observable<{friends: UserInterface[], chat: ChatInterface, no: { read: string[] }}>
  {
    if(!!this.first) query = {...query, first: this.first};
    let params = query && !!Object.keys(query).length ? query : undefined;
    return this.http.get<{
      friends: UserInterface[],
      messages: MessageInterface[],
      chat: ChatInterface,
      no: { read: string[] }
    }>(`${this.configUrl}/api/chat/conversation`,
      {params}
    ).pipe(
      tap(( dto: { friends: UserInterface[], chat: ChatInterface, no: { read: string[] } } ) => {
        this.setFriends = dto.friends;
        this.setChat = dto.chat;
        if(!!this.friends.length){
          this.setActiveConversation = this.friends[0].id;
          this.setActiveFriend = 0;
          this.setNoReadMessage = !!dto.no.read.length;
          this.setNoReadFriend = dto.no.read;
        }
        if(!!this.first) this.clearFirstUser().subscribe();
      }),
      catchError(this.httpService.handleError),
    )
  }

  getCompanion(query?: { id?: string }) {
    return this.http.get(`${this.configUrl}/api/chat/companion`,{
      params: query,
    }).pipe(
      take(1),
      tap(() => {

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
        this.setActiveFriend = index;
        this.setActiveConversation = id;
        this.setChat = chat
        this.checkNoRead(id);
      })
    )
  }

  companion(id: string): Observable<UserInterface>{
    return this.http.get<UserInterface>(`${this.configUrl}/api/chat/companion/${id}`).pipe(
      take(1),
      tap((companion: UserInterface) => {
        this.friends.push(companion);
        this.friends$.next(this.friends);
      }),
      catchError(this.httpService.handleError),
    )
  }

  sendNewMessage(message: string): Observable<MessageInterface> {
    return this.http.put<MessageInterface>(`${this.configUrl}/api/chat/send/${this.chat.id}`,{message}).pipe(
      take(1),
      catchError(this.httpService.handleError)
    )
  }

  appendFriend(friend: UserInterface) {
    if( this.friends.some( fr => fr.id !== friend.id) ){
      this.friends.push(friend);
      this.friends$.next(this.friends);
    }
  }

  setFirstUser(id: string) {
    if(!!id) {
      this.first = id;
      this.first$.next(this.first)
    };
    return from([]);
  }

  clearFirstUser() {
    this.first = null;
    this.first$.next(null);
    return from([]);
  }

  checkNoRead(id: string) {
    let findIndex = this.noReadFriend.findIndex((id: string) => id === id);
    if(findIndex !== -1){
      this.noReadFriend.splice(findIndex, 1);
      this.noReadFriend$.next(this.noReadFriend);

      this.noReadMessage = !!this.noReadFriend.length;
      this.noReadMessage$.next(this.noReadMessage);
    }
  }

  set setFriends(friends: UserInterface[]) {
    this.friends = friends;
    this.friends$.next(this.friends);
  }

  set setChat(chat: ChatInterface) {
    this.chat = chat;
    this.chat$.next(this.chat);
  }

  set setActiveConversation(id: string) {
    this.activeConversation = id;
    this.activeConversation$.next(this.activeConversation);
  }

  set setActiveFriend(index: number) {
    this.activeFriend = index;
    this.activeFriend$.next(this.activeFriend);
  }

  set setNoReadMessage(bool: boolean) {
    this.noReadMessage = bool;
    this.noReadMessage$.next(this.noReadMessage);
  }

  set setNoReadFriend(noRead: string[]) {
    this.noReadFriend = noRead;
    this.noReadFriend$.next(this.noReadFriend);
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
        return of(chat?.chat);
      })
    );
  }

  get getActiveConversation(): Observable<string> {
    return this.activeConversation$.asObservable();
  }

  get getMessageLimited(): Observable<boolean> {
    return this.messageLimited$.asObservable();
  }

  get getNoRead(): Observable<boolean> {
    return this.noReadMessage$.asObservable();
  }

  get getNoReadFriend(): Observable<string[]> {
    return this.noReadFriend$.asObservable();
  }
}
