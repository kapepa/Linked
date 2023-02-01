import {Component, OnInit, OnDestroy} from '@angular/core';
import {ChatService} from "../../core/service/chat.service";
import {ChatInterface} from "../../core/interface/chat.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy{
  view: boolean = true;

  chat: ChatInterface;
  chatSub: Subscription;

  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.chatSub = this.chatService.getChat.subscribe((chat: ChatInterface) => {
      this.chat = chat;
      this.view = true;
    });
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
  }

  onBack(e: Event) {
    this.view = !this.view
  }

  get getView () {
    return this.view;
  }
}
