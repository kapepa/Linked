import { Injectable } from '@nestjs/common';
import { ChatInterface } from "./chat.interface";
import { from, Observable, of, switchMap, take, tap } from "rxjs";
import { MessageInterface } from "./message.interface";
import { UsersDto } from "../users/users.dto";
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "./chat.entity";
import { DeleteResult, Repository } from "typeorm";
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
    where?: {[key: string]: string | string[] | { [key: string]: string } },
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" },
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
      relations: ['friends', 'chat'],
      order: { chat: { updated_at: "DESC" } },
    }).pipe(
      take(1),
      switchMap((users: UsersInterface) => {
        let chat = users.chat[0];
        return this.findMessage({
          where: { chat: { id: chat.id } },
          order: { created_at: "DESC" },
          relations: ['owner'],
          skip: 0,
          take: 20
        }).pipe(
          switchMap((messages: MessageInterface[]) => {
            return of({ friends: users.friends, chat: { ...chat,  chat: messages.reverse()} });
          })
        );
      })
    )
  }

  getChat( friendID: string, userID: string ){
    return this.findOneChat({
      where: { conversation: [userID, friendID] },
      relations: ['conversation']
    }).pipe(
      switchMap((chat: ChatInterface) => {
        // '66f4faed-8c42-48f5-943d-85b9366c12d8'
        console.log(chat.id)
        return of('test chat')
        // return this.findMessage({
        //   where: { chat: { id: chat.id } },
        //   order: { created_at: "DESC" },
        //   relations: ['chat', 'owner'],
        //   skip: 0,
        //   take: 20,
        // }).pipe(
        //   switchMap((messages: MessageInterface[]) => {
        //     // console.log(messages)
        //     return of({...chat, chat: messages.reverse()})
        //   })
        // )
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
          tap(() => this.chatRepository.save({ ...chat, chat: chat.chat.concat(dto) }))
        );
      })
    )
  }

  async removeChat(chat: ChatInterface[]){
    await this.chatRepository.remove(chat as Chat[])
  }

}
