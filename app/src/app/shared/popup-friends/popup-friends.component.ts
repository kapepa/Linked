import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {UserInterface} from "../../core/interface/user.interface";
import {Observable, Subscription} from "rxjs";
import {UserService} from "../../core/service/user.service";
import {FriendsInterface} from "../../core/interface/friends.interface";
import {PersonService} from "../../core/service/person.service";

@Component({
  selector: 'app-popup-friends',
  templateUrl: './popup-friends.component.html',
  styleUrls: ['./popup-friends.component.scss'],
})
export class PopupFriendsComponent implements OnInit, OnDestroy {
  user: UserInterface;
  userSub: Subscription;

  @Input('closePopupFriends') closePopupFriends: () => void;

  constructor(
    private userService: UserService,
    private personService: PersonService,
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onAccept(request: FriendsInterface, index: number) {
    this.personService.confirmFriends(request.user.id).subscribe(() => {
      this.userService.exceptRequest(index).subscribe(() => {
        this.closePopupFriends();
      });
    })
  }

  onDecline(request: FriendsInterface ,index: number) {
    this.personService.cancelFriend(request.id).subscribe(() => {
      this.userService.exceptRequest(index).subscribe(() => {
        this.closePopupFriends();
      });
    })
  }

  get getSuggest(): boolean {
    return !!this.user.suggest.length;
  }
}
