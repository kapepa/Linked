import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from "../../core/service/chat.service";
import { UserInterface } from "../../core/interface/user.interface";
import { Subscription } from "rxjs";

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

  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.friendsSub = this.chatService.getFriends.subscribe(( friends: UserInterface[] ) => {
      this.friends = friends;
    })
    this.activeConversationSub = this.chatService.getActiveConversation.subscribe(( active: string ) => {
      this.activeConversation = active;
    })
  }

  ngOnDestroy() {
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
    this.chatService.changeActiveConversation(id, index).subscribe(() => {});
  }

}
