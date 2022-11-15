import { Injectable } from '@nestjs/common';
import { ChatInterface } from "./chat.interface";
import { from, Observable, of, switchMap, take } from "rxjs";
import { MessageInterface } from "./message.interface";
import { UsersDto } from "../users/users.dto";
import { UsersService } from "../users/users.service";
import { UsersInterface } from "../users/users.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "./chat.entity";
import {Repository} from "typeorm";
import {MessageEntity} from "./message.entity";

@Injectable()
export class ChatService {
  chat = {
    id: 'first',
    chat: [
      {
        id: 'chatID',
        message: "Test message",
        owner: {avatar: "0e7df187-6072-4b8b-b465-cb23ec24ae25png.png",email: "test@mail.com", firstName: "FirstName", id: "ca249d3f-9cfe-49ff-aafd-b2e2ab7323b7",lastName:"LastName", role: "user", suggest: []}
      }
    ],
  } as ChatInterface;

  constructor(
    private usersService: UsersService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  findOne(id: string, query?: { take?: number, skip: number }): Observable<ChatInterface> {
    return of(this.chat)
  }

  addNewMessage(payload: {id: string, dto: MessageInterface}): Observable<any> {
    if(!payload.id) this.createChat(payload.dto)
    let createMessage = Object.assign({id: Date.now()}, payload.dto);
    this.chat.chat.push(createMessage);
    return from([createMessage]);
  }

  deleteMessage(id: string): Observable<string> {
    this.chat.chat = this.chat.chat.filter(message => message.id !== id);
    return from([id]);
  }

  conversation(user: UsersDto): Observable<any> {
    return this.usersService.findOne('id', user.id, {relations: ['friends']}).pipe(
      take(1),
      switchMap((users: UsersInterface) => {
        return of({ friends: users.friends });
      })
    )
  }

  createChat(dto: MessageInterface){
    return from(this.chatRepository.save({}))
    console.log(dto)
  }

  createMessage(dto: MessageInterface){

  }
}
