import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from "../../core/service/chat.service";
import { UserInterface } from "../../core/interface/user.interface";
import { Subscription } from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tape-friends',
  templateUrl: './tape-friends.component.html',
  styleUrls: ['./tape-friends.component.scss'],
})
export class TapeFriendsComponent implements OnInit, OnDestroy {
  friends: UserInterface[];
  friendsSub: Subscription;

  activeConversation: string;
  activeConversationSub: Subscription

  noRead: string[];
  noReadSub: Subscription;

  constructor(
    private router: Router,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.friendsSub = this.chatService.getFriends.subscribe(( friends: UserInterface[] ) => {
      this.friends = friends;
    })
    this.activeConversationSub = this.chatService.getActiveConversation.subscribe(( active: string ) => {
      this.activeConversation = active;
    })
    this.noReadSub = this.chatService.getNoReadFriend.subscribe((noRead: string[]) => {
      this.noRead = noRead;
    });
  }

  ngOnDestroy() {
    this.noReadSub.unsubscribe();
    this.friendsSub.unsubscribe();
    this.activeConversationSub.unsubscribe();
  }

  loadData(event) {
    // setTimeout(() => {
    //   console.log('Done');
    //   event.target.complete();
    //
    //   if (data.length === 1000) {
    //     event.target.disabled = true;
    //   }
    // }, 500);
  }

  onFriends(id: string, index: number) {
    this.chatService.changeActiveConversation(id, index).subscribe((chat) => {
      if( this.router.url === '/chat/mobile/friends' ) this.router.navigate(['chat/mobile/message'])
    });
  }

}
