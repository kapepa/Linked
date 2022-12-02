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
    where?: {
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }
    },
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" } },
    skip?: number,
    take?: number,
  }): Observable<ChatInterface> {
    return from(this.chatRepository.findOne({ ...options }));
  }

  findChat(options?:{
    where?: {
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }
    },
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" } },
    skip?: number,
    take?: number,
  }): Observable<ChatInterface[]> {
    return from(this.chatRepository.find({ ...options }));
  }

  findMessage(options?: {
    where?: { [key: string]: string | { [key: string]: string | { [key: string]: string | { [key: string]: string } } } },
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

  conversation(user: UsersDto, query?: {skip?: number, take?: number, first?: string}): Observable<{ friends: UsersInterface[], chat: ChatInterface }> {
    return this.usersService.findOneUser( {
      where: { id: user.id },
      relations: ['chat', 'chat.chat', 'chat.conversation', 'chat.chat.owner', 'friends'],
      order: { chat: { updated_at: "DESC" } },
    }).pipe(
      take(1),
      switchMap((users: UsersInterface) => {
        let chatSort = users.chat.sort((chat: ChatInterface) => chat.chat.length ? -1 : 1);
        if( !!query.first ) users.chat.sort((chat: ChatInterface) => (chat.conversation[0].id === query.first || chat.conversation[1].id === query.first ) ? -1 : 1);
        let sortFried = chatSort.reduce(( accum: UsersInterface[], chat: ChatInterface ) => {
          accum.push(...chat.conversation.filter((person: UsersInterface) => person.id !== user.id));
          return accum;
        }, [] as UsersInterface[]);
        let chat = chatSort[0];

        // this.chatRepository.delete({id: 'ef3b5f70-7db4-415c-8055-e4f43aba34ec'})
        // this.chatRepository.delete({id: 'e0607a40-6d52-4153-9f11-1a67c1a10a36'})

        return !!chat ?
          of({ friends: sortFried, chat: { ...chat, chat: chat.chat.splice(-20) } }):
          of({ friends: sortFried, chat: {} as ChatInterface });
      })
    )
  }

  getChat( friendID: string, user: UsersDto ): Observable<ChatInterface>{
    return from(this.usersService.findOneUser({
      where: { id: friendID  },
      relations: ['chat', 'chat.conversation',]
    })).pipe(
      switchMap(( profile: UsersInterface ) => {
        let chat = profile.chat.find(( chat: ChatInterface ) => chat.conversation.some((person: UsersInterface) => person.id === user.id))

        return this.findMessage({
          where: { chat: { id: chat.id } },
          order: { created_at: "DESC" },
          relations: [ 'owner', 'chat' ],
          take: 20,
          skip: 0,
        }).pipe(switchMap((message: MessageInterface[]) => {
          return from([{...chat, chat: message.reverse()}])
        }))
      })
    )
  }

  createChat(){
    return from(this.chatRepository.save( {} )).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.chatRepository.findOne({ where: { id: chat.id}, relations: ['conversation'] }))
      })
    );
  }

  saveChat(chat: ChatInterface){
    return from(this.chatRepository.save(chat));
  }

  deleteChat(userID: string, friendID: string) {
    return from(this.chatRepository.findOne({where: { conversation: [ {id: userID}, {id: friendID} ] }, relations: ['chat'] })).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.messageRepository.remove(chat.chat as any)).pipe(
          switchMap(() => from(this.chatRepository.delete({id: chat.id})))
        )
      })
    )
    // return from(this.chatRepository.findOne({where: { conversation: [ {id: userID}, {id: friendID} ] }, relations: ['chat'] }))
    //   .pipe(
    //     tap((chat: ChatInterface) => {
    //       from(this.messageRepository.remove(chat.chat as any))
    //         .pipe(
    //           tap(() => this.chatRepository.delete({id: chat.id}))
    //         )
    //     })
    //   )
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
