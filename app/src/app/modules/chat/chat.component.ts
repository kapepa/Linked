import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatInterface } from "../../core/interface/chat.interface";
import { Subscription } from "rxjs";
import { UserInterface } from "../../core/interface/user.interface";
import { UserService } from "../../core/service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ChatService } from "../../core/service/chat.service";
import { MessageInterface } from "../../core/interface/message.interface";
import { SocketService } from "../../core/service/socket.service";
import {MessageDto} from "../../core/dto/message.dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  textarea = this.fb.group({
    message: ['', Validators.required],
  });
  chatID: string;

  chat = [] as MessageInterface[];
  chatSub: Subscription;

  user: UserInterface;
  userSub: Subscription;

  messages: MessageInterface[];
  messagesSub: Subscription;

  friends: UserInterface[];
  friendsSub: Subscription;

  limited: boolean;
  limitedSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private chatService: ChatService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.limitedSub = this.chatService.getMessageLimited.subscribe(( limited: boolean ) => this.limited = limited);
    this.friendsSub = this.chatService.getFriends.subscribe((friends: UserInterface[]) => this.friends = friends);
    this.messagesSub = this.chatService.getMessages.subscribe((messages: MessageInterface[]) => {
      this.messages = messages;
    });
    this.chatSub = this.chatService.getChat.subscribe((chat: ChatInterface) => {
      if(!!chat?.id || !!chat?.chat){
        this.chatID = chat.id;
        this.chat = chat.chat;
        this.socketService.appendToRoom(this.chatID)
      };
    });
  };

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.chatSub.unsubscribe();
    this.messagesSub.unsubscribe();
    this.friendsSub.unsubscribe();
  };

  onSubmit() {
    if(!this.textarea.valid) return;

    this.chatService.sendNewMessage(this.textarea.value.message).subscribe((message: MessageInterface) => {
      this.chatService.messageReceive(message);
      this.textarea.reset();
    })
  };

  onDel(index: number) {
    let message = Object.assign(this.chat[index],{});
    this.chatService.deleteMessage(index, message).subscribe((dto: { chatID: string , message: MessageInterface }) => {
      this.socketService.messageDel(dto);
      this.textarea.reset();
    });
  };

  loadData(event) {
    this.chatService.loadMessage().subscribe({
      next: () => event.target.complete(),
      error: () => event.target.complete(),
    });
  }
}
