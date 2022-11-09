import { Injectable } from '@nestjs/common';
import { ChatInterface } from "./chat.interface";
import { from, Observable, of } from "rxjs";
import { MessageInterface } from "./message.interface";

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
  } as ChatInterface

  findOne(id: string, query?: { take?: number, skip: number }): Observable<ChatInterface> {
    return of(this.chat)
  }

  addNewMessage(message: MessageInterface) {
    let createMessage = Object.assign({id: Date.now()}, message);
    this.chat.chat.push(createMessage);
    return from([createMessage]);
  }

  deleteMessage(id: string): Observable<string> {
    this.chat.chat = this.chat.chat.filter(message => message.id !== id);
    return from([id]);
  }
}
