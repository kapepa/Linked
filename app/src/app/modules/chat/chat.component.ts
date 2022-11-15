import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatInterface, MessageInterface } from "../../core/interface/chat.interface";
import { Subscription } from "rxjs";
import { UserInterface } from "../../core/interface/user.interface";
import { UserService } from "../../core/service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { SocketService } from "../../core/service/chat.service";

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

  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.chatSub = this.socketService.getChat.subscribe((chat: ChatInterface) => {
      if(!!chat?.id || !!chat?.chat){
        this.chatID = chat.id;
        this.chat = chat.chat;
      };
    });
  };

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.chatSub.unsubscribe();
  };

  onSubmit() {
    if(!this.textarea.valid) return;
    let newMessage = { owner: this.user, message: this.textarea.value.message } as MessageInterface;

    this.socketService.message(this.chatID, newMessage).subscribe(() => {
      this.textarea.reset();
    });
  };

  onDel(index: number) {
    let message = Object.assign(this.chat[index],{});
    this.socketService.deleteMessage(index, message).subscribe(() => {
      this.textarea.reset();
    });
  };
}
