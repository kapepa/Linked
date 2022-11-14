import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from "../../core/service/chat.service";
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

  constructor(
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.friendsSub = this.socketService.getFriends.subscribe(( friends: UserInterface[] ) => {
      this.friends = friends;
    })
  }

  ngOnDestroy() {
    this.friendsSub.unsubscribe();
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

  onFriends(id: string) {
    console.log(id)
  }

}
