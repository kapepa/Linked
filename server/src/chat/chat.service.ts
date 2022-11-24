import { Injectable } from '@nestjs/common';
import { ChatInterface } from "./chat.interface";
import { from, Observable, of, switchMap, take, tap } from "rxjs";
import { MessageInterface } from "./message.interface";
import { UsersDto } from "../users/users.dto";
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "./chat.entity";
import {DeleteResult, In, Repository} from "typeorm";
import { MessageEntity } from "./message.entity";

@Injectable()
export class ChatService {

  constructor(
    private usersService: UsersService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  findOneChat(options?:{
    where?: {
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto }
    },
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" } },
    skip?: number,
    take?: number,
  }): Observable<ChatInterface> {
    return from(this.chatRepository.findOne({ ...options }));
  }

  findMessage(options?: {
    where?: { [key: string]: string | { [key: string]: string } },
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC"},
    skip?: number,
    take?: number,
  }): Observable<MessageInterface[]>{
    return from(this.messageRepository.find({ ...options, }))
  }

  addNewMessage(payload: {id: string, dto: MessageInterface}): Observable<MessageInterface> {
    return this.createMessage(payload.id, payload.dto);
  }

  deleteMessage(id: string): Observable<DeleteResult> {
    return from(this.messageRepository.delete({id}));
  }

  conversation(user: UsersDto): Observable<{ friends: UsersInterface[], chat: ChatInterface }> {
    return this.usersService.findOneUser( {
      where: { id: user.id },
      relations: ['friends', 'friends.chat', 'chat', 'chat.chat'],
      order: {
        friends: { chat: { updated_at: "ASC" } },
        // chat: { chat: { created_at: "ASC" } },
      },
    }).pipe(
      take(1),
      switchMap((users: UsersInterface) => {
        let chat = users.chat[0];
        return this.findMessage({
          where: { chat: { id: chat.id } },
          order: { created_at: "ASC" },
          relations: ['owner'],
          skip: 0,
          take: 20
        }).pipe(
          switchMap((messages: MessageInterface[]) => {
            return of({ friends: users.friends, chat: { ...chat,  chat: messages} });
          })
        );
      })
    )
  }

  getChat( friendID: string, user: UsersDto ){
    return from(this.findOneChat({
      where: { conversation: { id: friendID }, chat: { owner: user } },
    })).pipe(
      switchMap(( chat: ChatInterface ) => {
        return this.findMessage({
          where: { chat: { id: chat.id } },
          order: { created_at: "DESC" },
          relations: [ 'owner' ],
          take: 20,
          skip: 0
,        }).pipe(switchMap((message: MessageInterface[]) => {
          return from([{...chat, chat: message.reverse()}])
        }))
      })
    )
  }

  createChat(user: UsersInterface | UsersDto, friend: UsersInterface){
    return from(this.chatRepository.save({ conversation: [friend, user] }));
  }

  deleteChat(userID: string, friendID: string) {
    return from(this.chatRepository.findOne({where: { conversation: [ {id: userID}, {id: friendID} ] }})).pipe(
      switchMap((chat: ChatInterface) => {
        return this.chatRepository.delete({ id: chat.id });
      })
    )
  }

  createMessage( chatID: string, dto: MessageInterface ): Observable<MessageInterface>{
    return from(this.findOneChat({ where: { id: chatID }, relations: ['chat'] })).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.messageRepository.save(dto)).pipe(
          switchMap( (message: MessageInterface) => {
            return from([message]);
          }),
          tap(() => this.chatRepository.save({ ...chat, chat: chat.chat.concat(dto), updated_at: new Date() }))
        );
      })
    )
  }

  async removeChat(chat: ChatInterface[]){
    await this.chatRepository.remove(chat as Chat[])
  }
}
