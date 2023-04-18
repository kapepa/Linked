import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ChatInterface} from "./chat.interface";
import {concatAll, from, map, Observable, of, switchMap, tap, toArray} from "rxjs";
import {MessageInterface} from "./message.interface";
import {UsersDto} from "../users/users.dto";
import {UsersService} from "../users/users.service";
import {UsersInterface} from "../users/users.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "./chat.entity";
import {Any, ArrayContains, DeleteResult, In, Not, Repository, UpdateResult} from "typeorm";
import {MessageEntity} from "./message.entity";
import {ChatGateway} from "./chat.gateway";
import {MessageDto} from "./message.dto";
import {MessageStatus} from "./status.enum";

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private chatGateway: ChatGateway
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
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | {[key: string]: string | {} }[] | {} | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }
    } | {[key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }}[],
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC"  | {[key: string]: "ASC" | "DESC" }} | [{[key: string]: "ASC" | "DESC" }] },
    skip?: number,
    take?: number,
  }): Observable<ChatInterface[]> {
    return from(this.chatRepository.find({ ...options }));
  }

  findMessage(options?: {
    where?: {
      [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } } | {}
    } | {[key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }}[],
    relations?: string[],
    order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" } | [{[key: string]: "ASC" | "DESC" }] },
    skip?: number,
    take?: number,
  }): Observable<MessageInterface[]>{
    return from(this.messageRepository.find({ ...options, }))
  }

  deleteMessage(id: string): Observable<DeleteResult> {
    return from(this.messageRepository.delete({id}));
  }

  deleteMessageOnID(chatID: string, messageID: string, user: UsersDto): Observable<DeleteResult> {
    return this.deleteMessage(messageID).pipe(
      tap(() => this.chatGateway.deleteMessage(chatID, messageID, user.id))
    );
  }

  deleteChatAndMessage(chat: ChatInterface): Observable<DeleteResult> {
    return from(this.messageRepository.delete({ chat: {id: chat.id }}))
      .pipe(switchMap(() => this.chatRepository.delete({id: chat.id})));
  }

  conversation(user: UsersDto, query?: {skip?: number, take?: number, first?: string}):
    Observable<{ friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } }> {
    let ChatFirstID: string;
    let result = { friends: [], chat: {} as ChatInterface, no: { read: [] } }

    let compareStatus = (chat: ChatInterface) => {
      for(let message of chat.chat) {
        if(message.status !== MessageStatus.WAITING) break;
        result.no.read.push(chat.id)
      }
    }

    let extractChat = (ids: string[], status?: MessageStatus.WAITING) => {
      return this.findChat({
        where: { id: In(ids), ...status ? {chat: { status: MessageStatus.WAITING  } } : undefined },
        order: { chat: { created_at: "DESC" }  },
        relations: ['chat', 'chat.owner', 'conversation'],
      }).pipe(
        tap((chat: ChatInterface[]) => {
            if(!!chat.length) chat.forEach((chat: ChatInterface) => {
              if(status !== MessageStatus.WAITING) result.friends.push(chat.conversation.find(profile => profile.id !== user.id));
              if(status === MessageStatus.WAITING) compareStatus(chat);
              if(!ChatFirstID) ChatFirstID = chat.id;
            })
          }
        ))
    }

    return this.usersService.findOneUser({
      where: {id: user.id},
      relations: ['chat', 'chat.chat', 'chat.conversation', 'chat.chat.owner'],
      order: { chat: { chat: { created_at: "DESC" }} },
    }).pipe(
      switchMap((user: UsersInterface) => {
        let ids = user.chat.map(chat => chat.id);
        return extractChat(ids, MessageStatus.WAITING).pipe(
          switchMap(() => {
            return extractChat(ids).pipe(
              switchMap(() => {
                return !result.friends.length
                  ? of(result)
                  : this.findMessage({
                    where: { chat: { id: ChatFirstID } },
                    relations: ['owner'],
                    order: { created_at: "DESC" },
                    skip: query.skip,
                    take: query.take
                    },
                  ).pipe(
                  switchMap((message: MessageInterface[]) => {
                    return of({...result, chat: {...result.chat, chat: message }})
                  })
                );
              })
            )
          })
        )}
      )
    )
  }

  getChat( friendID: string, user: UsersDto ): Observable<ChatInterface>{
    return from(this.usersService.findOneUser({
      where: { id: friendID  },
      relations: ['chat', 'chat.conversation',],
    })).pipe(
      switchMap(( profile: UsersInterface ) => {
        let chat = profile.chat.find(( chat: ChatInterface ) => chat.conversation.some((person: UsersInterface) => person.id === user.id));

        return this.findMessage({
          where: { chat: { id: chat.id } },
          order: { created_at: "DESC" },
          relations: [ 'owner', 'chat' ],
          take: 20,
          skip: 0,
        }).pipe(switchMap((message: MessageInterface[]) => {
          return from([{...chat, chat: message.reverse()}]).pipe(
            tap(() => {
              this.statusMessage(chat.id).subscribe();
            })
          )
        }))
      })
    )
  }

  companion(id: string): Observable<UsersInterface> {
    return this.usersService.findOneUser({ where: { id } });
  }

  createChat(): Observable<ChatInterface>{
    return from(this.chatRepository.save( {} )).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.chatRepository.findOne({ where: { id: chat.id }, relations: ['conversation'] }));
      })
    );
  }

  saveChat(chat: ChatInterface){
    return from(this.chatRepository.save(chat));
  }

  deleteChat(userID: string, friendID: string): Observable<DeleteResult> {
    return from(this.chatRepository.findOne({where: { conversation: [ {id: userID}, {id: friendID} ] }, relations: ['chat'] })).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.messageRepository.remove(chat.chat as any)).pipe(
          switchMap(() => from(this.chatRepository.delete({id: chat.id})))
        )
      })
    )
  }

  createMessage( chatID: string, message: MessageDto, user: UsersDto ): Observable<MessageInterface>{
    return from(this.findOneChat({ where: { id: chatID }, relations: ['chat', 'conversation'] })).pipe(
      switchMap((chat: ChatInterface) => {
        return from(this.messageRepository.save({...message, owner: user})).pipe(
          switchMap( (message: MessageInterface) => {
            return from([message]).pipe(
              tap(() => {
                of(this.chatRepository.save({ ...chat, chat: chat.chat.concat(message),  updated_at: new Date()}))
                  .pipe(
                    tap(() => {
                      let [ profile, companion ] = chat.conversation;
                      let sendToUser = profile.id === user.id ? companion : profile;
                      let userID = profile.id !== user.id ? companion : profile;
                      this.chatGateway.newMessage(sendToUser.id, userID.id, chat.id, message);
                    })
                  )
                  .subscribe()
              })
            );
          }),
        );
      })
    )
  }

  statusMessage(chatID: string): Observable<Promise<UpdateResult>>{
    return from([this.messageRepository.update({ chat: { id: chatID }, status: MessageStatus.WAITING }, {status: MessageStatus.READING})]);
  }

  async removeChat(chat: ChatInterface[]){
    await this.chatRepository.remove(chat as Chat[])
  }
}
